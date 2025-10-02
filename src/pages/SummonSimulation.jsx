import { useState } from "react";
import heroesData from "../data/heroes.json";
import pets from "../data/pets.json";
import "./SummonSimulation.css";

// "아멜리아" 제거된 heroes 배열
const heroes = heroesData.filter((h) => h.name !== "아멜리아");

// ---------------- 확률 테이블 ----------------
const RATES = {
  normal: {
    // 1~99회
    SS: { total: 0.4, pickup: 0.1 },
    S: { total: 0.6, pickup: 0.1 },
    A: { total: 14, pickup: 1.75 },
    B: { total: 40 },
    C: { total: 45 },
  },
  guarantee100: {
    SS: { total: 40, pickup: 10 },
    S: { total: 60, pickup: 10 },
  },
  after100: {
    S: { total: 0.6, pickup: 0.2 },
    A: { total: 14, pickup: 3.5 },
    B: { total: 40 },
    C: { total: 45 },
  },
  guarantee200: {
    SS: { pickup: 20 },
    S: { pickup: 20 },
  },
};

const MAX_SELECT = {
  group1: 2, // SS
  group2: 3, // S
  group3: 4, // A
};

// 가중치 랜덤 추출 (items, weights)
function weightedRandom(items, weights) {
  const total = weights.reduce((a, b) => a + b, 0);
  if (total <= 0) return null;
  const rand = Math.random() * total;
  let acc = 0;
  for (let i = 0; i < items.length; i++) {
    acc += weights[i];
    if (rand <= acc) return items[i];
  }
  return items[items.length - 1];
}

// 등급 결정 (일반 소환에서 사용)
function getGradeByProbability(summonCount) {
  const rand = Math.random() * 100;
  let table;

  if (summonCount < 100) table = RATES.normal;
  else if (summonCount > 100 && summonCount < 200) table = RATES.after100;
  else table = RATES.normal; // 200 이상인 경우 실제 확정 슬롯에서는 이 함수를 사용하지 않음

  // 누적 비교 (SS -> S -> A -> B -> C)
  if (rand < table.SS.total) return "SS";
  if (rand < table.SS.total + table.S.total) return "S";
  if (rand < table.SS.total + table.S.total + table.A.total) return "A";
  if (rand < table.SS.total + table.S.total + table.A.total + table.B.total)
    return "B";
  return "C";
}

// 위시리스트 그룹명 반환
function getWishlistGroup(hero) {
  if (hero.grade === "SS") return "group1";
  if (hero.grade === "S") return "group2";
  if (hero.grade === "A") return "group3";
  return null;
}

// 위시리스트 완성 여부 확인
function isWishlistFullySelected(wishlist) {
  return (
    wishlist.group1.length === MAX_SELECT.group1 &&
    wishlist.group2.length === MAX_SELECT.group2 &&
    wishlist.group3.length === MAX_SELECT.group3
  );
}

// ---------------- 확률/추출 관련 ----------------

// 개별 영웅 확률 계산 (픽업 확률 표시용)
function getHeroProbability(hero, wishlist, summonCount) {
  const grade = hero.grade;
  const candidates = heroes.filter(
    (h) => h.grade === grade && !h.excludeFromSummon
  );
  const selected =
    grade === "SS"
      ? wishlist.group1
      : grade === "S"
      ? wishlist.group2
      : grade === "A"
      ? wishlist.group3
      : [];

  // 200회 확정: SS/S 픽업만 (각각 20%)
  if (summonCount >= 200 && (grade === "SS" || grade === "S")) {
    return selected.includes(hero.name) ? RATES.guarantee200[grade].pickup : 0;
  }

  // 100회 확정(정확히 100): SS/S만 해당
  if (summonCount === 100 && (grade === "SS" || grade === "S")) {
    const table = RATES.guarantee100[grade];
    const usedPickup = selected.length * table.pickup;
    const remain = table.total - usedPickup;
    const others = candidates.length - selected.length;
    if (selected.includes(hero.name)) return table.pickup;
    if (others <= 0) return 0;
    return remain / others;
  }

  // 101~199회: after100 테이블 적용
  if (summonCount > 100 && summonCount < 200) {
    if (grade === "SS" || grade === "S" || grade === "A") {
      const table = RATES.after100[grade];
      const usedPickup = selected.length * (table.pickup || 0);
      const remain = table.total - usedPickup;
      const others = candidates.length - selected.length;
      if (selected.includes(hero.name)) return table.pickup || 0;
      if (others <= 0) return 0;
      return remain / others;
    }
    // B/C: 균등 분배
    const table = RATES.after100[grade];
    return table.total / candidates.length;
  }

  // 일반 확률 1~99
  if (grade === "SS" || grade === "S" || grade === "A") {
    const table = RATES.normal[grade];
    const usedPickup = selected.length * (table.pickup || 0);
    const remain = table.total - usedPickup;
    const others = candidates.length - selected.length;
    if (selected.includes(hero.name)) return table.pickup || 0;
    if (others <= 0) return 0;
    return remain / others;
  }

  // B/C 일반
  const table = RATES.normal[grade];
  return table.total / candidates.length;
}

// 무작위 영웅 추출 (등급 별)
function getRandomHeroByGrade(grade, wishlist, summonCount) {
  let candidates = heroes.filter(
    (h) => h.grade === grade && !h.excludeFromSummon
  );

  // 200회 확정: SS/S 픽업만 (각 픽업 20%)
  if (summonCount >= 200 && (grade === "SS" || grade === "S")) {
    const selected = wishlist[grade === "SS" ? "group1" : "group2"];
    const filtered = candidates.filter((h) => selected.includes(h.name));
    if (filtered.length === 0) return null;
    return weightedRandom(
      filtered,
      filtered.map(() => 1)
    );
  }

  // 100회 확정 (정확히 100일 때) -> SS/S 확정 풀 (픽업 포함)
  if (summonCount === 100 && (grade === "SS" || grade === "S")) {
    const table = RATES.guarantee100[grade];
    const selected = wishlist[grade === "SS" ? "group1" : "group2"];
    const usedPickup = selected.length * table.pickup;
    const remain = table.total - usedPickup;
    const others = candidates.filter((h) => !selected.includes(h.name));
    const weights = candidates.map((h) =>
      selected.includes(h.name)
        ? table.pickup
        : others.length > 0
        ? remain / others.length
        : 0
    );
    return weightedRandom(candidates, weights);
  }

  // 101~199회
  if (summonCount > 100 && summonCount < 200) {
    if (grade === "SS" || grade === "S" || grade === "A") {
      const table = RATES.after100[grade];
      const selected =
        wishlist[
          grade === "SS" ? "group1" : grade === "S" ? "group2" : "group3"
        ];
      const usedPickup = selected.length * (table.pickup || 0);
      const remain = table.total - usedPickup;
      const others = candidates.filter((h) => !selected.includes(h.name));
      const weights = candidates.map((h) =>
        selected.includes(h.name)
          ? table.pickup || 0
          : others.length > 0
          ? remain / others.length
          : 0
      );
      return weightedRandom(candidates, weights);
    }
    // B/C
    const per = RATES.after100[grade].total / Math.max(candidates.length, 1);
    return weightedRandom(
      candidates,
      candidates.map(() => per)
    );
  }

  // 일반 소환(1~99)
  if (grade === "SS" || grade === "S" || grade === "A") {
    const table = RATES.normal[grade];
    const selected =
      wishlist[grade === "SS" ? "group1" : grade === "S" ? "group2" : "group3"];
    const usedPickup = selected.length * (table.pickup || 0);
    const remain = table.total - usedPickup;
    const others = candidates.filter((h) => !selected.includes(h.name));
    const weights = candidates.map((h) =>
      selected.includes(h.name)
        ? table.pickup || 0
        : others.length > 0
        ? remain / others.length
        : 0
    );
    return weightedRandom(candidates, weights);
  }

  // B/C 일반
  const per = RATES.normal[grade].total / Math.max(candidates.length, 1);
  return weightedRandom(
    candidates,
    candidates.map(() => per)
  );
}

// ---------------- 펫 소환 관련 ----------------
function getRandomPetByGrade(grade, petData) {
  const candidates = petData.filter((p) => p.grade === grade);
  if (candidates.length === 0) return null;
  const idx = Math.floor(Math.random() * candidates.length);
  return candidates[idx];
}

function getPetGradeByProbability() {
  const rand = Math.random() * 100;
  if (rand < 1) return "S";
  if (rand < 10) return "A";
  if (rand < 41.5) return "B";
  return "C";
}

// ---------------- 소환(10연차) 로직 ----------------
function summonTenHeroes(wishlistGroups, summonCount = 0) {
  const results = [];

  // 10연차 안에 정확히 100 또는 200에 걸치는지 계산
  const willHit100 = summonCount < 100 && summonCount + 10 >= 100;
  const willHit200 = summonCount < 200 && summonCount + 10 >= 200;

  let guaranteedSlot = -1; // 10개 중 어느 인덱스가 확정 슬롯인지 (0~9)
  if (willHit200) guaranteedSlot = 200 - summonCount - 1;
  else if (willHit100) guaranteedSlot = 100 - summonCount - 1;

  for (let i = 0; i < 10; i++) {
    let grade = null;
    let hero = null;

    // 확정 슬롯이면 별도 처리
    if (i === guaranteedSlot) {
      if (willHit200) {
        const ssSelected = wishlistGroups.group1;
        const sSelected = wishlistGroups.group2;
        const pickupNames = [...ssSelected, ...sSelected];
        const pickupCandidates = heroes.filter((h) =>
          pickupNames.includes(h.name)
        );
        if (pickupCandidates.length > 0) {
          hero = weightedRandom(
            pickupCandidates,
            pickupCandidates.map(() => 1)
          );
        } else {
          // 만약 픽업이 없으면 fallback으로 평상시 확률 사용
          grade = getGradeByProbability(summonCount + i);
          hero = getRandomHeroByGrade(grade, wishlistGroups, summonCount + i);
        }
      } else {
        // 100회 확정: SS 40% / S 60% 비율로 등급 결정 후 해당 등급에서 위시 포함 확률 반영
        const pickSS = Math.random() * 100 < RATES.guarantee100.SS.total; // 40% -> SS
        grade = pickSS ? "SS" : "S";
        hero = getRandomHeroByGrade(grade, wishlistGroups, 100);
      }
    } else {
      // 일반 슬롯
      const currentEffective = summonCount + i;
      grade = getGradeByProbability(currentEffective);
      hero = getRandomHeroByGrade(grade, wishlistGroups, currentEffective);
    }

    if (hero) results.push({ ...hero, flipped: false });
  }

  return results;
}

function summonTenPets(petData, summonCount = 0) {
  const results = [];
  for (let i = 0; i < 10; i++) {
    const grade = getPetGradeByProbability();
    const pet = getRandomPetByGrade(grade, petData);
    if (pet) results.push({ ...pet, flipped: false });
  }
  return results;
}

// ---------------- React 컴포넌트 ----------------
export default function SummonSimulation() {
  const [summonedHeroes, setSummonedHeroes] = useState([]);
  const [summonCount, setSummonCount] = useState(0); // 0 ~ 200
  const [showWishlist, setShowWishlist] = useState(false);
  const [petSummonCount, setPetSummonCount] = useState(0); // 0 ~ 100
  const [summonedPets, setSummonedPets] = useState([]);
  const [activeTab, setActiveTab] = useState("hero");
  const [wishlist, setWishlist] = useState({
    group1: [],
    group2: [],
    group3: [],
  });

  // 카드 뒤집기
  const handleFlip = (idx) => {
    setSummonedHeroes((prev) =>
      prev.map((h, i) => (i === idx ? { ...h, flipped: true } : h))
    );
  };

  const handlePetFlip = (idx) => {
    setSummonedPets((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, flipped: true } : p))
    );
  };

  // 위시리스트 클릭
  const handleWishlistClick = (hero) => {
    const group = getWishlistGroup(hero);
    if (!group) return;
    const selected = wishlist[group].includes(hero.name);
    if (selected) {
      setWishlist((prev) => ({
        ...prev,
        [group]: prev[group].filter((n) => n !== hero.name),
      }));
    } else {
      if (wishlist[group].length >= MAX_SELECT[group]) return;
      setWishlist((prev) => ({
        ...prev,
        [group]: [...prev[group], hero.name],
      }));
    }
  };

  // 펫 10연차 버튼
  const handlePetSummon = () => {
    setSummonedPets((prev) => prev.map((p) => ({ ...p, flipped: false })));
    const newPets = summonTenPets(pets, petSummonCount);
    const hasS = newPets.some((p) => p.grade === "S");
    setTimeout(() => {
      setSummonedPets(newPets);
      setPetSummonCount((prev) => {
        if (hasS) return 0;
        return Math.min(prev + 10, 100);
      });
      setActiveTab("pet");
    }, 300);
  };

  // 영웅 10연차 버튼
  const handleSummon = () => {
    // 위시리스트 필수 체크
    if (!isWishlistFullySelected(wishlist)) {
      // 안전장치: 버튼은 보통 비활성화해놓지만, 혹시 호출되면 early return
      return;
    }

    setSummonedHeroes((prev) => prev.map((h) => ({ ...h, flipped: false })));
    const newHeroes = summonTenHeroes(wishlist, summonCount);

    const hasSOrSS = newHeroes.some((h) => h.grade === "S" || h.grade === "SS");
    const hasPickup = newHeroes.some(
      (h) =>
        (h.grade === "S" || h.grade === "SS") &&
        (wishlist.group1.includes(h.name) || wishlist.group2.includes(h.name))
    );

    setTimeout(() => {
      setSummonedHeroes(newHeroes);
      setSummonCount((prev) => {
        if (hasPickup) return 0; // 픽업 당첨 시 카운트 초기화
        if (hasSOrSS && prev < 100) return 100; // S/SS 당첨이면 100으로 점프(100확정 상태로)
        return Math.min(prev + 10, 200);
      });
      setActiveTab("hero");
    }, 300);
  };

  const progressPercent = Math.min((summonCount / 200) * 100, 100);
  const petProgressPercent = Math.min((petSummonCount / 100) * 100, 100);

  return (
    <div className="summon-page page">
      <h2 className="summon-title">소환 시뮬레이션</h2>

      <div className="button-row">
        <button
          className="summon-button"
          onClick={() => handleSummon()}
          disabled={!isWishlistFullySelected(wishlist)}
        >
          영웅 10회 소환
        </button>

        <button className="summon-button" onClick={() => handlePetSummon()}>
          펫 10회 소환
        </button>

        <button
          className="wishlist-toggle-button"
          onClick={() => setShowWishlist((prev) => !prev)}
        >
          위시리스트 {showWishlist ? "닫기" : "열기"}
        </button>
      </div>

      <div className="progress-container">
        <div
          className="progress-bar"
          style={{ width: `${progressPercent}%` }}
        />
        <div className="progress-text">{`영웅 소환 ${summonCount}/200`}</div>
      </div>

      <div className="progress-container">
        <div
          className="progress-bar"
          style={{ width: `${petProgressPercent}%` }}
        />
        <div className="progress-text">{`펫 소환 ${petSummonCount}/100`}</div>
      </div>

      {activeTab === "hero" && (
        <div className="card-grid">
          {summonedHeroes.map((hero, idx) => (
            <div
              key={idx}
              className={`card ${hero.flipped ? "flipped" : ""} ${
                hero.grade === "SS"
                  ? "grade-SS"
                  : hero.grade === "S"
                  ? "grade-S"
                  : ""
              }`}
              onClick={() => handleFlip(idx)}
            >
              <div className="card-inner">
                <div className="card-front">
                  <img
                    src={
                      hero.grade === "SS" ||
                      hero.grade === "S" ||
                      hero.grade === "A"
                        ? "/스페셜.png"
                        : "/일반.png"
                    }
                    alt="카드 뒷면"
                    className="card-image"
                  />
                </div>
                <div className="card-back">
                  <img
                    src={`/도감/${hero.group}/아이콘/${hero.name}.png`}
                    alt={hero.name}
                    className="card-image"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "pet" && (
        <div className="card-grid">
          {summonedPets.map((pet, idx) => (
            <div
              key={idx}
              className={`card ${pet.flipped ? "flipped" : ""} ${
                pet.grade === "S" ? "grade-S" : ""
              }`}
              onClick={() => handlePetFlip(idx)}
            >
              <div className="card-inner">
                <div className="card-front">
                  <img
                    src={
                      pet.grade === "S" || pet.grade === "A"
                        ? "/스페셜.png"
                        : "/펫일반.png"
                    }
                    alt="펫카드 뒷면"
                    className="card-image"
                  />
                </div>
                <div className="card-back">
                  <img
                    src={`/도감/펫/아이콘/${pet.name}.png`}
                    alt={pet.name}
                    className="card-image"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showWishlist && (
        <div className="wishlist-tooltip">
          <h3>위시리스트 선택</h3>

          {/* 그룹 1: SS */}
          <div className="wishlist-group">
            <h4 className="wishlist-group-title">
              그룹 1: SS (최대 {MAX_SELECT.group1}명)
            </h4>
            <div className="wishlist-grid">
              {heroes
                .filter((h) => h.grade === "SS" && !h.excludeFromSummon)
                .map((hero) => {
                  const selected = wishlist.group1.includes(hero.name);
                  const prob = getHeroProbability(hero, wishlist, summonCount);
                  return (
                    <div key={hero.name} className="wishlist-item">
                      <img
                        src={`/도감/${hero.group}/아이콘/${hero.name}.png`}
                        alt={hero.name}
                        className={`wishlist-hero ${
                          selected ? "selected" : ""
                        }`}
                        onClick={() => handleWishlistClick(hero)}
                      />
                      <div className="wishlist-prob">
                        {prob !== null ? `${prob.toFixed(3)}%` : ""}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* 그룹 2: S */}
          <div className="wishlist-group">
            <h4 className="wishlist-group-title">
              그룹 2: S (최대 {MAX_SELECT.group2}명)
            </h4>
            <div className="wishlist-grid">
              {heroes
                .filter((h) => h.grade === "S" && !h.excludeFromSummon)
                .map((hero) => {
                  const selected = wishlist.group2.includes(hero.name);
                  const prob = getHeroProbability(hero, wishlist, summonCount);
                  return (
                    <div key={hero.name} className="wishlist-item">
                      <img
                        src={`/도감/${hero.group}/아이콘/${hero.name}.png`}
                        alt={hero.name}
                        className={`wishlist-hero ${
                          selected ? "selected" : ""
                        }`}
                        onClick={() => handleWishlistClick(hero)}
                      />
                      <div className="wishlist-prob">
                        {prob !== null ? `${prob.toFixed(3)}%` : ""}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* 그룹 3: A */}
          <div className="wishlist-group">
            <h4 className="wishlist-group-title">
              그룹 3: A (최대 {MAX_SELECT.group3}명)
            </h4>
            <div className="wishlist-grid">
              {heroes
                .filter((h) => h.grade === "A" && !h.excludeFromSummon)
                .map((hero) => {
                  const selected = wishlist.group3.includes(hero.name);
                  const prob = getHeroProbability(hero, wishlist, summonCount);
                  return (
                    <div key={hero.name} className="wishlist-item">
                      <img
                        src={`/도감/${hero.group}/아이콘/${hero.name}.png`}
                        alt={hero.name}
                        className={`wishlist-hero ${
                          selected ? "selected" : ""
                        }`}
                        onClick={() => handleWishlistClick(hero)}
                      />
                      <div className="wishlist-prob">
                        {prob !== null ? `${prob.toFixed(3)}%` : ""}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {!isWishlistFullySelected(wishlist) && (
        <div className="wishlist-warning">
          ⚠️ 영웅소환은 위시리스트를 선택해주세요.
        </div>
      )}
    </div>
  );
}
