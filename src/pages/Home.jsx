import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeroSlide from "../components/HeroSlide";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Home.css";

// 효과별 검색 키워드
const ABILITY_SEARCH_KEYWORDS = [
  "물리 공격력 증가",
  "마법 공격력 증가",
  "모든 공격력 증가",
  "방어력 증가",
  "모든 피해량 증가",
  "감쇄",
  "약점 공격 확률 증가",
  "치명타 확률 증가",
  "치명타 피해 증가",
  "효과 적중 증가",
  "효과 저항 증가",
  "물리 피해량 증가",
  "마법 피해량 증가",
  "물리 감쇄",
  "마법 감쇄",
  "막기 확률 증가",
  "3인 공격기 감쇄",
  "5인 공격기 감쇄",
  "주는 회복량 증가",
  "받는 회복량 증가",
  "효과 적용 확률 증가",
  "즉사 효과 적용 확률 증가",
  "피해량 증가",
  "효과 적중률 증가",
  "최대 생명력 증가",
  "치명타 피해량 증가",
  "물리 공격력 감소",
  "마법 공격력 감소",
  "모든 공격력 감소",
  "방어력 감소",
  "모든 피해량 감소",
  "약점 공격 확률 감소",
  "치명타 확률 감소",
  "치명타 피해 감소",
  "효과 적중 감소",
  "효과 저항 감소",
  "물리 취약",
  "마법 취약",
  "물리 피해량 감소",
  "마법 피해량 감소",
  "막기 확률 감소",
  "빗나감 확률 증가",
  "받는 회복량 감소",
  "주는 회복량 감소",
  "회복 불가",
  "기절",
  "마비",
  "감전",
  "빙결",
  "침묵",
  "수면",
  "석화",
  "실명",
  "기절 면역",
  "감전 면역",
  "마비 면역",
  "빙결 면역",
  "침묵 면역",
  "수면 면역",
  "행동 제어 면역",
  "석화 면역",
  "실명 면역",
  "즉사",
  "출혈",
  "화상",
  "중독",
  "화상 면역",
  "즉사 면역",
  "출혈 면역",
  "중독 면역",
  "턴제 버프 감소",
  "버프 해제",
  "디버프 면역",
  "디버프 해제",
  "피해 면역",
  "피해 무효화",
  "불사",
  "축복",
  "권능",
  "위장",
  "링크",
  "부활",
  "보호막",
  "회복",
  "지속 회복",
  "피해량 비례 회복",
  "협공",
  "반격",
  "관통",
  "방어 무시",
  "고정 피해",
  "도발",
  "흡혈",
  "쿨타임 감소",
  "쿨타임 초기화",
  "폭발",
  "스킬 변환",
  "집중 공격",
  "영멸",
  "생명력 전환",
  "처형",
  "쿨타임 증가",
];

export default function Home() {
  const navigate = useNavigate();

  // 날짜 선택 상태
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 고정 이벤트 목록
  const [events] = useState([
    {
      title: "정식 오픈",
      start: "2025-05-15",
      end: "2025-05-15",
    },
    {
      title: "제이브 & 레이첼 & 바네사 영웅 픽업 소환 및 성장 이벤트",
      start: "2025-05-15",
      end: "2025-05-28",
    },
    {
      title: "태오 & 타카 업데이트",
      start: "2025-05-29",
      end: "2025-05-29",
    },
    {
      title: "태오 & 타카 영웅 픽업 소환 및 영웅 성장 이벤트",
      start: "2025-05-29",
      end: "2025-06-11",
    },
    {
      title: "시나리오 이벤트 : [늦게 피는 꽃]",
      start: "2025-05-29",
      end: "2025-06-11",
    },
    {
      title: "연희 업데이트",
      start: "2025-06-12",
      end: "2025-06-12",
    },
    {
      title: "연희 영웅 픽업 소환 및 영웅 성장 이벤트",
      start: "2025-06-12",
      end: "2025-06-25",
    },
    {
      title: "골드 러시 이벤트",
      start: "2025-06-12",
      end: "2025-06-25",
    },
    {
      title: "멜키르 업데이트",
      start: "2025-06-26",
      end: "2025-06-26",
    },
    {
      title: "멜키르 시나리오 이벤트 [최후의 시간선]",
      start: "2025-06-26",
      end: "2025-07-09",
    },
    {
      title: "멜키르 픽업 소환 및 영웅 성장 이벤트",
      start: "2025-06-26",
      end: "2025-07-09",
    },
    {
      title: "길드전 대비! 레이드 장비 추가 획득 이벤트",
      start: "2025-06-26",
      end: "2025-07-09",
    },
    {
      title: "린 & 카르마 업데이트",
      start: "2025-07-10",
      end: "2025-07-10",
    },
    {
      title: "린 & 카르마 시나리오 이벤트 [침묵하는 뿔 나팔과 길 잃은 전사들]",
      start: "2025-07-10",
      end: "2025-07-24",
    },
    {
      title: "린 & 카르마 픽업 소환 및 영웅 성장 이벤트",
      start: "2025-07-10",
      end: "2025-07-24",
    },
    {
      title: "세나의 달 기념! 대보물시대 이벤트",
      start: "2025-07-10",
      end: "2025-08-07",
    },
    {
      title: "세나의 달 기념 대보물시대 출석 이벤트",
      start: "2025-07-10",
      end: "2025-08-21",
    },
    {
      title: "콜트 업데이트",
      start: "2025-07-24",
      end: "2025-07-24",
    },
    {
      title: "콜트 픽업 소환 및 영웅 성장 이벤트",
      start: "2025-07-24",
      end: "2025-08-08",
    },
    {
      title: "플라튼 업데이트",
      start: "2025-08-07",
      end: "2025-08-07",
    },
    {
      title: "플라튼 소환 및 영웅 성장 이벤트",
      start: "2025-08-07",
      end: "2025-08-21",
    },
    {
      title: "비스킷 업데이트",
      start: "2025-08-21",
      end: "2025-08-21",
    },
    {
      title: "비스킷 소환 및 영웅 성장 이벤트",
      start: "2025-08-21",
      end: "2025-09-04",
    },
    {
      title: "비스킷 시나리오 이벤트 [물려받은 대장간이 폐업 위기?!]",
      start: "2025-08-21",
      end: "2025-09-04",
    },
    {
      title: "✨100일 기념✨ 이벤트",
      start: "2025-08-21",
      end: "2025-09-18",
    },
    {
      title: "데이지 & 오를리 업데이트",
      start: "2025-09-04",
      end: "2025-09-04",
    },
    {
      title: "데이지 & 오를리 소환 및 영웅 성장 이벤트",
      start: "2025-09-04",
      end: "2025-09-18",
    },
    {
      title: "클라한 & 미호 업데이트",
      start: "2025-09-18",
      end: "2025-09-18",
    },
    {
      title: "클라한 & 미호 소환 및 영웅 성장 이벤트",
      start: "2025-09-18",
      end: "2025-10-02",
    },
    {
      title: "시나리오 이벤트 [버림받은 꽃은 하늘을 탐한다]",
      start: "2025-09-18",
      end: "2025-10-02",
    },
    {
      title: "카구라 & 아멜리아 업데이트",
      start: "2025-10-02",
      end: "2025-10-02",
    },
    {
      title: "카구라 소환 및 영웅 성장 이벤트",
      start: "2025-10-02",
      end: "2025-10-16",
    },
    {
      title: "🌕보름달 맞이🌕 이벤트 안내",
      start: "2025-10-02",
      end: "2025-10-16",
    },
    {
      title: "카일 & 아킬라 업데이트",
      start: "2025-10-16",
      end: "2025-10-16",
    },
    {
      title: "카일 & 아킬라 소환 및 영웅 성장 이벤트",
      start: "2025-10-16",
      end: "2025-10-30",
    },
    {
      title: "시나리오 이벤트 [하늘이 멸한 폭풍의 뿌리]",
      start: "2025-10-16",
      end: "2025-10-30",
    },
  ]);

  // 날짜 포맷 문자열 변환
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 특정 날짜 이벤트 리스트
  const getEventsForDate = (date) => {
    const target = formatDate(date);
    return events.filter((e) => e.start <= target && target <= e.end);
  };

  // 검색 키워드 입력 상태
  const [searchKeyword, setSearchKeyword] = useState("");

  return (
    <div className="page home-layout">
      {/* 검색 바 */}
      <div className="home-search-bar">
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="영웅 또는 펫 이름을 검색하세요"
          onKeyDown={(e) => {
            if (e.key === "Enter" && searchKeyword.trim()) {
              navigate("/dex", {
                state: {
                  group: "검색",
                  name: searchKeyword.trim(),
                },
              });
            }
          }}
        />
      </div>

      <div className="main">
        {/* 왼쪽 섹션 */}
        <aside className="home-sidebar">
          {/* 업데이트 게시판 */}
          <section className="home-panel">
            <h2>업데이트 게시판</h2>
            <ul className="update-list">
              <li>
                <a href="https://game.naver.com/lounge/sena_rebirth/board/detail/6797065">
                  [2025-10-16]업데이트 내역
                </a>
              </li>
              <li>
                <a href="https://game.naver.com/lounge/sena_rebirth/board/detail/6738528">
                  [2025-10-02]업데이트 내역
                </a>
              </li>
              <li>
                <a href="https://game.naver.com/lounge/sena_rebirth/board/detail/6679745">
                  [2025-09-18]업데이트 내역
                </a>
              </li>
              <li>
                <a href="https://game.naver.com/lounge/sena_rebirth/board/detail/6619898">
                  [2025-09-04]업데이트 내역
                </a>
              </li>
              <li>
                <a href="https://game.naver.com/lounge/sena_rebirth/board/detail/6554778">
                  [2025-08-21]업데이트 내역
                </a>
              </li>
              <li>
                <a href="https://game.naver.com/lounge/sena_rebirth/board/detail/6493269">
                  [2025-08-07]업데이트 내역
                </a>
              </li>
              <li>
                <a href="https://game.naver.com/lounge/sena_rebirth/board/detail/6418126">
                  [2025-07-24]업데이트 내역
                </a>
              </li>
              <li>
                <a href="https://game.naver.com/lounge/sena_rebirth/board/detail/6332179">
                  [2025-07-10]업데이트 내역
                </a>
              </li>
              <li>
                <a href="https://game.naver.com/lounge/sena_rebirth/board/detail/6254363">
                  [2025-06-26]업데이트 내역
                </a>
              </li>
              <li>
                <a href="https://game.naver.com/lounge/sena_rebirth/board/detail/6184591">
                  [2025-06-12]업데이트 내역
                </a>
              </li>
              <li>
                <a href="https://game.naver.com/lounge/sena_rebirth/board/detail/6103024">
                  [2025-05-29]업데이트 내역
                </a>
              </li>
              <li>
                <a href="https://game.naver.com/lounge/sena_rebirth/board/detail/6056683">
                  [2025-05-21]업데이트 내역
                </a>
              </li>
            </ul>
          </section>
          {/* 효과별 검색 버튼 */}
          <section className="home-panel">
            <h2>효과별 검색</h2>
            <div className="ability-shortcut-list">
              {ABILITY_SEARCH_KEYWORDS.map((keyword) => (
                <button
                  key={keyword}
                  className="ability-shortcut-button"
                  onClick={() =>
                    navigate("/dex", {
                      state: { group: "검색", ability: keyword },
                    })
                  }
                >
                  {keyword}
                </button>
              ))}
            </div>
          </section>
        </aside>

        {/* 중앙 섹션 */}
        <main className="home-main">
          {/* 유튜브 영상 슬라이드 */}
          <section className="home-panel">
            <Slider
              dots={false}
              infinite={true}
              speed={500}
              slidesToShow={1}
              slidesToScroll={1}
              className="youtube-slider"
            >
              <div className="youtube-slide">
                <iframe
                  src="https://www.youtube.com/embed/4vyr3qgp34g?si=445MmppyMwm8TLvd"
                  title="Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="youtube-slide">
                <iframe
                  src="https://www.youtube.com/embed/-1D5piRKdCw?si=lXYAOQwYIcO8lne_"
                  title="Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="youtube-slide">
                <iframe
                  src="https://www.youtube.com/embed/NqlVWEFUG2k?si=hq0v6kSCPuo6S6Ue"
                  title="Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="youtube-slide">
                <iframe
                  src="https://www.youtube.com/embed/NsNN7Wh5PQM?si=F66ceCv88GczbINu"
                  title="Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="youtube-slide">
                <iframe
                  src="https://www.youtube.com/embed/JCOr-cnIyRI?si=gUuAPdxGd-XfffVX"
                  title="Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="youtube-slide">
                <iframe
                  src="https://www.youtube.com/embed/oLQwY0PjnMo?si=tDBnobAXcj9IfguE"
                  title="Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="youtube-slide">
                <iframe
                  src="https://www.youtube.com/embed/1ZU2XymKMrQ?si=4rxXMKj-mN7W-ua0"
                  title="Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="youtube-slide">
                <iframe
                  src="https://www.youtube.com/embed/g3N385AR62M?si=ndLIKk8Be-d9qsRY"
                  title="Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="youtube-slide">
                <iframe
                  src="https://www.youtube.com/embed/IUEtGmNr3Fs?si=heH_wOPn-9um_stf"
                  title="Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="youtube-slide">
                <iframe
                  src="https://www.youtube.com/embed/vqUWJkINvNw?si=2fGm0hq0L-MUf0Vv"
                  title="Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="youtube-slide">
                <iframe
                  src="https://www.youtube.com/embed/IFloybp-jAA?si=aZ7Famb48ivaHq1x"
                  title="Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="youtube-slide">
                <iframe
                  src="https://www.youtube.com/embed/EnOkopRFwEU?si=ShCZr-pGjdZVWFNE"
                  title="Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="youtube-slide">
                <iframe
                  src="https://www.youtube.com/embed/FIjwDZz-7To?si=YaGVbYG1pVsgQ_Fp"
                  title="Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="youtube-slide">
                <iframe
                  src="https://www.youtube.com/embed/d_3vkvDTh_Q?si=8ZvuCZSHV15--64d"
                  title="Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="youtube-slide">
                <iframe
                  src="https://www.youtube.com/embed/_aSDFxuZOqM?si=Be5geaxd-cud32KP"
                  title="Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="youtube-slide">
                <iframe
                  src="https://www.youtube.com/embed/o2XgDY-Sa64?si=bHgbY1haGLhXzPHL"
                  title="Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="youtube-slide">
                <iframe
                  src="https://www.youtube.com/embed/iDre1B2VKo4?si=f89eVSuULxaqZyXY"
                  title="Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="youtube-slide">
                <iframe
                  src="https://www.youtube.com/embed/aD_PiRg3W64?si=vocuPbj42s5zbENg"
                  title="Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="youtube-slide">
                <iframe
                  src="https://www.youtube.com/embed/n_57XYC7RlM?si=Lz2eWqTFlZzfg3bl"
                  title="Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="youtube-slide">
                <iframe
                  src="https://www.youtube.com/embed/lpCCxFjBVXs?si=N3eNfkLf7mmpp36b"
                  title="Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="youtube-slide">
                <iframe
                  src="https://www.youtube.com/embed/E0RNQxitvRo?si=uzYq3F5LWuhChhV6"
                  title="Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="youtube-slide">
                <iframe
                  src="https://www.youtube.com/embed/ibfSpdseLRE?si=mnqMRDvC9IlZt5Mw"
                  title="Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="youtube-slide">
                <iframe
                  src="https://www.youtube.com/embed/etB--_9ChFw?si=q_kF78FXY07LWI3N"
                  title="Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="youtube-slide">
                <iframe
                  src="https://www.youtube.com/embed/_61N2S7MV30?si=Sm3KGij4mD9eURVO"
                  title="Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="youtube-slide">
                <iframe
                  src="https://www.youtube.com/embed/xST7BL3NoYM?si=QUoR9gww1SXosfIq"
                  title="Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="youtube-slide">
                <iframe
                  src="https://www.youtube.com/embed/uyU-r8nh0sA?si=TvIhwONDwA9VbZQH"
                  title="Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="youtube-slide">
                <iframe
                  src="https://www.youtube.com/embed/9o0NqifUIrI?si=HbqlgcsNRCq1MPMv"
                  title="Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="youtube-slide">
                <iframe
                  src="https://www.youtube.com/embed/aB5RO_EvRT8?si=z_MsuCFUz_HjVfeN"
                  title="Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="youtube-slide">
                <iframe
                  src="https://www.youtube.com/embed/LHD6Ib-5M90?si=hbC1sQxvaqVHcz3r"
                  title="Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="youtube-slide">
                <iframe
                  src="https://www.youtube.com/embed/RrRM7rW_Oho?si=UNnB03XWVOBEyU2z"
                  title="Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </Slider>
          </section>

          {/* 이벤트 캘린더 */}
          <section className="home-panel">
            <h2>이벤트 캘린더</h2>
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              tileClassName={({ date, view }) => {
                if (view !== "month") return null;

                const isToday =
                  date.getFullYear() === new Date().getFullYear() &&
                  date.getMonth() === new Date().getMonth() &&
                  date.getDate() === new Date().getDate();

                const isThursday = date.getDay() === 4;

                if (isToday) return "today-tile";
                if (isThursday) return "thursday-tile";
                return null;
              }}
              tileContent={({ date, view }) => {
                if (view !== "month") return null;
                const target = formatDate(date);
                const dayEvents = events.filter(
                  (e) => e.start <= target && target <= e.end
                );
                if (dayEvents.length === 0) return null;
                return (
                  <div
                    className="event-dot-bar"
                    title={dayEvents
                      .map((e) => `${e.title} (${e.start}~${e.end})`)
                      .join("\n")}
                  ></div>
                );
              }}
              prev2Label={null}
              next2Label={null}
            />

            {getEventsForDate(selectedDate).length > 0 && (
              <div className="calendar-selected-event">
                {formatDate(selectedDate)}의 이벤트:
                <ul>
                  {getEventsForDate(selectedDate).map((e, i) => (
                    <li key={i}>
                      • {e.title} ({e.start} ~ {e.end})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
          {/* 영웅 도감 슬라이드 */}
          <section className="home-panel">
            <div className="top">
              <h3>영웅 도감</h3>
              <p
                className="more-link"
                onClick={() => navigate("/dex", { state: { group: "스페셜" } })}
              >
                더보기
              </p>
            </div>
            <HeroSlide />
          </section>
        </main>

        {/* 오른쪽 섹션 */}
        <aside className="home-sidebar">
          {/* 레이드 바로가기 패널 */}
          <section className="home-panel">
            <h2>레이드</h2>
            <ul className="home-raid-list">
              {[
                { name: "파멸의눈동자", img: "/레이드/선택/파멸의눈동자.png" },
                { name: "우마왕", img: "/레이드/선택/우마왕.png" },
                { name: "강철의포식자", img: "/레이드/선택/강철의포식자.png" },
              ].map((raid, i) => (
                <li
                  key={raid.name}
                  className={`home-raid-card ${i === 0 ? "selected" : ""}`}
                  onClick={() =>
                    navigate("/raid", { state: { name: raid.name } })
                  }
                >
                  <img src={raid.img} alt={raid.name} />
                  <span>{raid.name}</span>
                </li>
              ))}
            </ul>
          </section>
          {/* 성장 던전 바로가기 패널 */}
          <section className="home-panel">
            <h2>성장 던전</h2>
            <ul className="GrowthDungeon-list">
              {[
                { name: "불의원소", img: "/성장던전/배경/불의원소.png" },
                { name: "물의원소", img: "/성장던전/배경/물의원소.png" },
                { name: "땅의원소", img: "/성장던전/배경/땅의원소.png" },
                { name: "빛의원소", img: "/성장던전/배경/빛의원소.png" },
                { name: "암흑의원소", img: "/성장던전/배경/암흑의원소.png" },
                { name: "골드", img: "/성장던전/배경/골드.png" },
              ].map((GrowthDungeon, i) => (
                <li
                  key={GrowthDungeon.name}
                  className={`GrowthDungeon-card ${i === 0 ? "selected" : ""}`}
                  onClick={() =>
                    navigate("/growth-dungeon", {
                      state: { name: GrowthDungeon.name },
                    })
                  }
                >
                  <img src={GrowthDungeon.img} alt={GrowthDungeon.name} />
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>

      {/* 이미지 영역 */}
      <footer className="home-ad-banner"></footer>
    </div>
  );
}
