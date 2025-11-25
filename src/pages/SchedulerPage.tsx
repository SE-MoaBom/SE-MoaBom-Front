import React from "react";
import Header from "../components/Header";
import BottomNavigation from "../components/BottomNavigation";

const SchedulerPage: React.FC = () => {
  return (
    <div className="scheduler-page">
      <Header />
      <div>스케줄러 페이지입니다</div>
      <BottomNavigation />
    </div>
  );
};

export default SchedulerPage;
