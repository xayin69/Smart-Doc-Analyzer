import SidebarHistory from "./SidebarHistory";
import ResultsPanel from "./Resultpanel";
import UploadPanel from "./Uploadpanel";
import RightPanel from "./RightPanel";

const WorkspaceLayout = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="stars" />

      <div className="relative z-10 h-full grid grid-cols-[280px_1fr_320px] gap-6 p-6 min-h-0">
        
        {/* Sidebar History */}
        <div className="panel-glass rounded-xl overflow-hidden">
          <SidebarHistory />
        </div>

        {/* Main Area - Stacked Vertically */}
        <div className="flex flex-col gap-6 min-h-0">
          {/* Results Panel (Top, Flex-1) */}
          <div className="flex-1 min-h-0 panel-glass rounded-xl overflow-hidden">
            <ResultsPanel />
          </div>

          {/* Upload Panel (Bottom, Auto Height) */}
          <div className="panel-glass rounded-xl overflow-hidden">
            <UploadPanel />
          </div>
        </div>

        {/* Right Panel */}
        <div className="panel-glass rounded-xl overflow-hidden">
          <RightPanel />
        </div>

      </div>
    </div>
  );
};

export default WorkspaceLayout;
