import SidebarHistory from "./SidebarHistory";
import ResultsPanel from "./Resultpanel";
import UploadPanel from "./Uploadpanel";
import RightPanel from "./RightPanel";
import "./WorkSpacestyles/workspace-layout.css";

const WorkspaceLayout = () => {
return (
  <div className="workspace-container">
    <div className="stars" />
    <div className="workspace-grid">
      
      {/* Sidebar */}
      <div className="panel-glass">
        <SidebarHistory />
      </div>

      {/* Center Column */}
      <div className="center-column">
        <div className="center-column-top panel-glass">
          <ResultsPanel />
        </div>
        <div className="center-column-bottom panel-glass">
          <UploadPanel />
        </div>
      </div>

      {/* Right Panel */}
      <div className="panel-glass">
        <RightPanel />
      </div>
      
    </div>
  </div>
);
};

export default WorkspaceLayout;
