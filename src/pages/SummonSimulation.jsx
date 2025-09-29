import { useState } from "react";
import heroes from "../data/heroes.json";
import pets from "../data/pets.json";
import "./SummonSimulation.css";

// 확정 소환 확률
const GUARANTEE_100 = {
  pickup: 10, // 픽업 영웅
  others: 50, // 나머지 영웅 합계
};

// 위시리스트 그룹별 최대 선택 개수
const MAX_SELECT = {
  group1: 2, // SS
  group2: 3, // S
  group3: 4, // A
};

// ------------------- ▼▼▼ 여기가 수정된 함수입니다 ▼▼▼ -------------------
// 확률 기반 등급 결정
function getGradeByProbability() {
  const rand = Math.random() * 100;

  // 기본 확률
  if (rand < 0.2353) return "SS"; // SS 총합
  if (rand < 1.0) return "S"; // S 총합
  if (rand < 15.0) return "A"; // A 14%
  if (rand < 55.0) return "B"; // B 40%
  return "C"; // C 45%
}
// ------------------- ▲▲▲ 여기가 수정된 함수입니다 ▲▲▲ -------------------

// 위시리스트 선택 확인
function isWishlistFullySelected(wishlist) {
  return (
    wishlist.group1.length === MAX_SELECT.group1 &&
    wishlist.group2.length === MAX_SELECT.group2 &&
    wishlist.group3.length === MAX_SELECT.group3
  );
}

// 가중치 랜덤 추출
function weightedRandom(items, weights) {
  const total = weights.reduce((a, b) => a + b, 0);
  const rand = Math.random() * total;
  let acc = 0;
  for (let i = 0; i < items.length; i++) {
    acc += weights[i];
    if (rand <= acc) return items[i];
  }
  return items[items.length - 1];
}

// 개별 영웅 확률 계산 (픽업창 표시용)
function getHeroProbability(hero, wishlistGroups, summonCount) {
  const grade = hero.grade;
  const candidates = heroes.filter(
    (h) => h.grade === grade && !h.excludeFromSummon
  );

  // 200회 확정 → 픽업 S/SS만
  if (summonCount >= 200 && (grade === "SS" || grade === "S")) {
    const selected =
      grade === "SS" ? wishlistGroups.group1 : wishlistGroups.group2;
    return selected.includes(hero.name) ? 100 : 0;
  }

  // 100회 확정
  if (summonCount === 100 && (grade === "SS" || grade === "S")) {
    const selected =
      grade === "SS" ? wishlistGroups.group1 : wishlistGroups.group2;
    return selected.includes(hero.name)
      ? GUARANTEE_100.pickup
      : GUARANTEE_100.others / candidates.length;
  }

  // 100 이후 ~ 200 미만 → 픽업 S/SS만 1% 균등
  if (
    summonCount > 100 &&
    summonCount < 200 &&
    (grade === "SS" || grade === "S")
  ) {
    const selected =
      grade === "SS" ? wishlistGroups.group1 : wishlistGroups.group2;
    return selected.includes(hero.name) ? 1 / selected.length : 0;
  }

  // ---- 일반 소환 ----
  if (grade === "SS") {
    const total = 0.2353;
    const selected = wishlistGroups.group1;
    const pickupRate = 0.1;
    const used = selected.length * pickupRate;
    const remain = total - used;
    const others = candidates.length - selected.length;

    if (selected.includes(hero.name)) return pickupRate;
    return others > 0 ? remain / others : 0;
  }

  if (grade === "S") {
    const total = 0.7647;
    const selected = wishlistGroups.group2;
    const pickupRate = 0.1;
    const used = selected.length * pickupRate;
    const remain = total - used;
    const others = candidates.length - selected.length;

    if (selected.includes(hero.name)) return pickupRate;
    return others > 0 ? remain / others : 0;
  }

  if (grade === "A") {
    const total = 14;
    const selected = wishlistGroups.group3;
    const pickupRate = 1.75;
    const used = selected.length * pickupRate;
    const remain = total - used;
    const others = candidates.length - selected.length;

    if (selected.includes(hero.name)) return pickupRate;
    return others > 0 ? remain / others : 0;
  }

  if (grade === "B") return 40 / candidates.length;
  if (grade === "C") return 45 / candidates.length;

  return null;
}

// 무작위 영웅 선택
function getRandomHeroByGrade(grade, wishlistGroups, summonCount) {
  let candidates = heroes.filter(
    (h) => h.grade === grade && !h.excludeFromSummon
  );

  // 200회 확정
  if (summonCount >= 200 && (grade === "SS" || grade === "S")) {
    const selected =
      grade === "SS" ? wishlistGroups.group1 : wishlistGroups.group2;
    candidates = candidates.filter((h) => selected.includes(h.name));
    return weightedRandom(
      candidates,
      candidates.map(() => 1)
    );
  }

  // 100회 확정
  if (summonCount === 100 && (grade === "SS" || grade === "S")) {
    const selected =
      grade === "SS" ? wishlistGroups.group1 : wishlistGroups.group2;
    const pickupHeroes = candidates.filter((h) => selected.includes(h.name));
    const others = candidates.filter((h) => !selected.includes(h.name));
    const weights = candidates.map((h) =>
      pickupHeroes.includes(h) ? 10 : 50 / others.length
    );
    return weightedRandom(candidates, weights);
  }

  // 100 이후 ~ 200 미만
  if (
    summonCount > 100 &&
    summonCount < 200 &&
    (grade === "SS" || grade === "S")
  ) {
    const selected =
      grade === "SS" ? wishlistGroups.group1 : wishlistGroups.group2;
    const pickupHeroes = candidates.filter((h) => selected.includes(h.name));
    return weightedRandom(
      pickupHeroes,
      pickupHeroes.map(() => 1)
    );
  }

  // 일반 소환
  if (grade === "SS") {
    const total = 0.2353;
    const selected = wishlistGroups.group1;
    const pickupRate = 0.1;
    const used = selected.length * pickupRate;
    const remain = total - used;
    const others = candidates.length - selected.length;

    const weights = candidates.map((h) =>
      selected.includes(h.name) ? pickupRate : others > 0 ? remain / others : 0
    );
    return weightedRandom(candidates, weights);
  }

  if (grade === "S") {
    const total = 0.7647;
    const selected = wishlistGroups.group2;
    const pickupRate = 0.1;
    const used = selected.length * pickupRate;
    const remain = total - used;
    const others = candidates.length - selected.length;

    const weights = candidates.map((h) =>
      selected.includes(h.name) ? pickupRate : others > 0 ? remain / others : 0
    );
    return weightedRandom(candidates, weights);
  }

  if (grade === "A") {
    const total = 14;
    const selected = wishlistGroups.group3;
    const pickupRate = 1.75;
    const used = selected.length * pickupRate;
    const remain = total - used;
    const others = candidates.length - selected.length;

    const weights = candidates.map((h) =>
      selected.includes(h.name) ? pickupRate : others > 0 ? remain / others : 0
    );
    return weightedRandom(candidates, weights);
  }

  if (grade === "B" || grade === "C") {
    const weight =
      grade === "B" ? 40 / candidates.length : 45 / candidates.length;
    const weights = candidates.map(() => weight);
    return weightedRandom(candidates, weights);
  }

  return null;
}

// 무작위 펫
function getRandomPetByGrade(grade, petData) {
  const candidates = petData.filter((p) => p.grade === grade);
  const randomIndex = Math.floor(Math.random() * candidates.length);
  return candidates[randomIndex];
}

// 펫 소환 확률
function getPetGradeByProbability() {
  const rand = Math.random() * 100;
  if (rand < 1) return "S";
  if (rand < 10) return "A";
  if (rand < 41.5) return "B";
  return "C";
}

// 영웅 10연차
function summonTenHeroes(wishlistGroups, summonCount = 0) {
  const results = [];

  // 이번 10회 소환 중에 확정 소환이 포함되는지 확인
  const willHit100 = summonCount < 100 && summonCount + 10 >= 100;
  const willHit200 = summonCount < 200 && summonCount + 10 >= 200;

  let guaranteedSlot = -1; // 확정 소환이 될 카드의 인덱스 (0-9)
  if (willHit200) {
    guaranteedSlot = 200 - summonCount - 1;
  } else if (willHit100) {
    guaranteedSlot = 100 - summonCount - 1;
  }

  for (let i = 0; i < 10; i++) {
    let grade;
    let hero;

    // 현재 뽑기가 확정 소환에 해당하는지 확인
    if (i === guaranteedSlot) {
      // 확정 소환 로직
      grade = Math.random() < 0.5 ? "SS" : "S";
      const milestone = willHit200 ? 200 : 100; // 확정 소환 종류(100/200) 전달
      hero = getRandomHeroByGrade(grade, wishlistGroups, milestone);
    } else {
      // 일반 소환 로직
      const currentEffectiveCount = summonCount + i;
      grade = getGradeByProbability(); // 기본 확률 함수 호출
      hero = getRandomHeroByGrade(grade, wishlistGroups, currentEffectiveCount);
    }

    if (hero) results.push({ ...hero, flipped: false });
  }

  return results;
}

// 펫 10연차
function summonTenPets(petData, summonCount) {
  const results = [];
  for (let i = 0; i < 10; i++) {
    const grade = getPetGradeByProbability();
    const pet = getRandomPetByGrade(grade, petData);
    if (pet) results.push({ ...pet, flipped: false });
  }
  return results;
}

// 위시리스트 그룹
function getWishlistGroup(hero) {
  if (hero.grade === "SS") return "group1";
  if (hero.grade === "S") return "group2";
  if (hero.grade === "A") return "group3";
  return null;
}

export default function SummonSimulation() {
  const [summonedHeroes, setSummonedHeroes] = useState([]);
  const [summonCount, setSummonCount] = useState(0);
  const [showWishlist, setShowWishlist] = useState(false);
  const [petSummonCount, setPetSummonCount] = useState(0);
  const [summonedPets, setSummonedPets] = useState([]);
  const [activeTab, setActiveTab] = useState("hero");
  const [wishlist, setWishlist] = useState({
    group1: [],
    group2: [],
    group3: [],
  });

  // 펫 소환
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
    }, 400);
  };

  // 영웅 소환
  const handleSummon = () => {
    setSummonedHeroes((prev) => prev.map((h) => ({ ...h, flipped: false })));
    const newHeroes = summonTenHeroes(wishlist, summonCount);

    const hasS = newHeroes.some((h) => h.grade === "S" || h.grade === "SS");
    const hasPickupS = newHeroes.some(
      (h) =>
        (h.grade === "S" || h.grade === "SS") &&
        [...wishlist.group1, ...wishlist.group2].includes(h.name)
    );

    setTimeout(() => {
      setSummonedHeroes(newHeroes);
      setSummonCount((prev) => {
        if (hasPickupS) return 0; // 픽업 S/SS → 초기화
        if (hasS && prev < 100) return 100; // S/SS → 100으로 점프
        return Math.min(prev + 10, 200);
      });
    }, 400);
  };

  // 카드 뒤집기
  const handleFlip = (idx) => {
    setSummonedHeroes((prev) =>
      prev.map((h, i) => (i === idx ? { ...h, flipped: true } : h))
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
        [group]: prev[group].filter((name) => name !== hero.name),
      }));
    } else {
      if (wishlist[group].length >= MAX_SELECT[group]) return;
      setWishlist((prev) => ({
        ...prev,
        [group]: [...prev[group], hero.name],
      }));
    }
  };

  const handlePetFlip = (idx) => {
    setSummonedPets((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, flipped: true } : p))
    );
  };

  const progressPercent = Math.min((summonCount / 200) * 100, 100);

  return (
    <div className="summon-page page">
      <h2 className="summon-title">소환 시뮬레이션</h2>
      <div className="button-row">
        <button
          className="summon-button"
          onClick={() => {
            handleSummon();
            setActiveTab("hero");
          }}
          disabled={!isWishlistFullySelected(wishlist)}
        >
          영웅 10회 소환
        </button>

        <button
          className="summon-button"
          onClick={() => {
            handlePetSummon();
            setActiveTab("pet");
          }}
        >
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
          style={{ width: `${(petSummonCount / 100) * 100}%` }}
        />
        <div className="progress-text">{`펫소환 ${petSummonCount}/100`}</div>
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
            <h4 className="wishlist-group-title">그룹 1: SS (최대 2명)</h4>
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
            <h4 className="wishlist-group-title">그룹 2: S (최대 3명)</h4>
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
            <h4 className="wishlist-group-title">그룹 3: A (최대 4명)</h4>
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
