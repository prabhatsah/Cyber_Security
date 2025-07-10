import { ReactFlowProvider } from 'reactflow';
import HierchicalViewInner from './HierchicalView';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function HierchicalViewWrapper(props: any) {
  return (
    <ReactFlowProvider>
      <HierchicalViewInner {...props} />
    </ReactFlowProvider>
  );
}
