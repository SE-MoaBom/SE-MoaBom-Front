import React from "react";
import Header from "../components/Header";
// import Footer from "../components/Footer";
import "../styles/mainPage.css";

const MainPage: React.FC = () => {
  const netflixShows = [
    {
      title: "Cybernetic Dawn",
      releaseDate: "Coming Apr 5",
      image: "/images/poster1.jpg",
    },
    {
      title: "The Emerald Isle",
      releaseDate: "Coming Apr 12",
      image: "/images/poster2.jpg",
    },
    {
      title: "Shadows in the City",
      releaseDate: "Coming Apr 19",
      image: "/images/poster3.jpg",
    },
    {
      title: "Mystery Quest",
      releaseDate: "Coming Apr 12",
      image: "/images/poster4.jpg",
    },
    {
      title: "Urban Legends",
      releaseDate: "Coming Apr 19",
      image: "/images/poster5.jpg",
    },
  ];

  const wavveShows = [
    {
      title: "Seoul Blues",
      releaseDate: "Now Streaming",
      image: "/images/poster6.jpg",
    },
    {
      title: "Weekend Challenge",
      releaseDate: "New Episode Friday",
      image: "/images/poster7.jpg",
    },
    {
      title: "Palace of Secrets",
      releaseDate: "Full Series Available",
      image: "/images/poster8.jpg",
    },
    {
      title: "Night Tales",
      releaseDate: "Now Streaming",
      image: "/images/poster9.jpg",
    },
    {
      title: "City Life",
      releaseDate: "New Episode Friday",
      image: "/images/poster10.jpg",
    },
  ];

  return (
    <div className="main-page">
      <Header />

      {/* Search Section */}
      <section className="search-section">
        <div className="search-container">
          <div className="search-input-wrapper">
            <svg
              className="search-icon"
              width="24"
              height="28"
              viewBox="0 0 24 28"
              fill="none"
            >
              <path
                d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                stroke="#9CA3AF"
                strokeWidth="2"
              />
              <path
                d="M21 21L16.65 16.65"
                stroke="#9CA3AF"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="시리즈, 영화를 검색해 보세요..."
            />
          </div>
        </div>
      </section>

      <main className="main">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-background" />
          <div className="hero-gradient" />
          <div className="hero-content">
            <h3 className="hero-title">극장판 주술회전: 회옥・옥절</h3>
            <div className="hero-buttons">
              <button className="play-button">
                <svg width="24" height="28" viewBox="0 0 24 28" fill="none">
                  <path
                    d="M8 6.82843V21.1716C8 22.7337 9.79086 23.6213 11.0503 22.6423L20.4214 15.4707C21.4625 14.6525 21.4625 13.3475 20.4214 12.5293L11.0503 5.35774C9.79086 4.37868 8 5.26631 8 6.82843Z"
                    fill="white"
                  />
                </svg>
                <span>재생</span>
              </button>
              <button className="info-button">
                <svg width="24" height="28" viewBox="0 0 24 28" fill="none">
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V11H13V17ZM13 9H11V7H13V9Z"
                    fill="white"
                  />
                </svg>
                <span>상세 정보</span>
              </button>
            </div>
          </div>
        </section>

        {/* Netflix Section */}
        <section className="content-section">
          <div className="content-container">
            <h3 className="section-title">Netflix 공개 예정</h3>
            <div className="content-scroll">
              {netflixShows.map((show, index) => (
                <div key={index} className="content-card">
                  <div className="poster-container">
                    <div
                      className="poster-image"
                      style={{ background: "#ccc" }}
                    >
                      {/* 이미지 placeholder */}
                    </div>
                  </div>
                  <h4 className="content-title">{show.title}</h4>
                  <div className="content-date">{show.releaseDate}</div>
                  <button className="add-button">
                    <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
                      <path
                        d="M8 4V16M2 10H14"
                        stroke="#1F2937"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span>보고싶은 목록에 추가</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Wavve Section */}
          <div className="content-container">
            <h3 className="section-title">Wavve 공개 예정</h3>
            <div className="content-scroll">
              {wavveShows.map((show, index) => (
                <div key={index} className="content-card">
                  <div className="poster-container">
                    <div
                      className="poster-image"
                      style={{ background: "#ccc" }}
                    >
                      {/* 이미지 placeholder */}
                    </div>
                  </div>
                  <h4 className="content-title">{show.title}</h4>
                  <div className="content-date">{show.releaseDate}</div>
                  <button className="add-button">
                    <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
                      <path
                        d="M8 4V16M2 10H14"
                        stroke="#1F2937"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span>보고싶은 목록에 추가</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default MainPage;
