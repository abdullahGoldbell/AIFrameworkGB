import { Composition } from "remotion";
import { HeroAmbient } from "./HeroAmbient";

const FPS = 30;
const DURATION_SECONDS = 8;

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="HeroAmbient"
        component={HeroAmbient}
        durationInFrames={FPS * DURATION_SECONDS}
        fps={FPS}
        width={1280}
        height={1280}
        defaultProps={{}}
      />
    </>
  );
};
