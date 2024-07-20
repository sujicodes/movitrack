import react from "react";
import "./TabContent.css"

const TabContent = ({ label, activeTab, children }) => {
    return (
        <div className={`tab-content ${activeTab === label ? '' : 'hidden'}`}>
            {children}
        </div>
    );
};

export default TabContent;