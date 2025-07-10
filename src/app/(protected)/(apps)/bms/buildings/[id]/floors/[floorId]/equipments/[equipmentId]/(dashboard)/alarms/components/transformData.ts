// Define or import stateColorMap
const stateColorMap: { [key: string]: string } = {
    critical: "red",
   warning: "yellow",
   normal: "green",
};

// Define or import TimelineBlock
interface TimelineBlock {
  from: number;
  to: number;
  statusStr: string;
  color: string;
}

interface RawAlert {
  data: {
    createdOn: string;
    lastStateChangeTime?: { fromState: string; toState: string; transitionTime: string }[];
  };
}

export const transformAlertData  = (input: RawAlert[]): TimelineBlock[] => {
    const blocks: TimelineBlock[] = [];
    //console.log("Input data:", input);
    // biome-ignore lint/complexity/noForEach: <explanation>
      input.forEach((entry) => {
      const changes = entry.data.lastStateChangeTime;
      //const createdTime = new Date(entry.data.createdOn).getTime();
      const createdTime = new Date(entry.data.createdOn).getTime();
  
      // If no state changes
      if (!changes || changes.length === 0) {
        blocks.push({
          from: createdTime,
          to: Date.now(),
          statusStr: `normal-${new Date(createdTime).toLocaleString()} to ${new Date().toLocaleString()}`,
          // biome-ignore lint/complexity/useLiteralKeys: <explanation>
          color: stateColorMap['normal'],
        });
        return;
      }
  
      let prevTime = createdTime;
      let prevState = changes[0].fromState;
  
      // biome-ignore lint/complexity/noForEach: <explanation>
        changes.forEach((transition) => {
        const toTime = new Date(transition.transitionTime).getTime();
        blocks.push({
          from: prevTime,
          to: toTime,
          statusStr: `${prevState}-${new Date(prevTime).toLocaleString()} to ${new Date(toTime).toLocaleString()}`,
          color: stateColorMap[prevState] || '#ccc',
        });
        prevTime = toTime;
        prevState = transition.toState;
      });
  
      // Last segment to now
      blocks.push({
        from: prevTime,
        to: Date.now(),
        statusStr: `${prevState}-${new Date(prevTime).toLocaleString()} to ${new Date().toLocaleString()}`,
        color: stateColorMap[prevState] || '#ccc',
      });
    });
  
    return blocks;
  };
  