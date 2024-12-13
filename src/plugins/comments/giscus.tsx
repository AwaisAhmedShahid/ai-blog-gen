import GiscusComponent from "@giscus/react";
import { useTheme } from "next-themes";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Giscus = ({ config }: any) => {
  const { theme } = useTheme();

  if (theme === "dark") {
    config.theme = "dark";
  }

  return <GiscusComponent id="comments" {...config} theme={theme} />;
};

export default Giscus;
