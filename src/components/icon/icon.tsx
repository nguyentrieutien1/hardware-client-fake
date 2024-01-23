import React, { ReactElement } from "react";
interface IconProps {
  IconComponent: any;
}
export default function Icon(props: IconProps) {
  const { IconComponent } = props;
  return (
    <div style={{ fontSize: 20 }}>
      <IconComponent />
    </div>
  );
}
