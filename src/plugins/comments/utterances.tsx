import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Utterances = ({ config }: any) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref: any = useRef(null);

  const { theme } = useTheme();

  useEffect(() => {
    if (!ref.current) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref?.current.childNodes.forEach((node: any) => node.remove());

    const script = document.createElement("script");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Object.keys(config).forEach((item: any) => {
      script.setAttribute(item, config[item]);
    });
    if (theme === "dark") {
      script.setAttribute("theme", "github-dark");
    }

    ref?.current.appendChild(script);

    return () => {
      if (ref.current) {
        // remove the script from the DOM

        // eslint-disable-next-line @typescript-eslint/no-explicit-any, react-hooks/exhaustive-deps
        ref?.current.childNodes.forEach((node: any) => node.remove());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  return <div ref={ref} />;
};

export default Utterances;
