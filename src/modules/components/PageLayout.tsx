import { FunctionComponent, PropsWithChildren } from "react";

const PageLayout: FunctionComponent<PropsWithChildren> = ({ children }) => {
  return (
    <div>
      <main>{children}</main>
    </div>
  );
};

export default PageLayout;
