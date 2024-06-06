import React from "react";
import ContentLoader, { Rect } from "react-content-loader/native";

const AppointmentLoader = (props) => (
  <ContentLoader
    width={355}
    height={600}
    viewBox="0 0 355 600"
    backgroundColor="#bfbfbf"
    foregroundColor="#ecebeb"
    {...props}
  >
    <Rect x="0" y="0" rx="3" ry="3" width="347" height="85" />
    <Rect x="20" y="20" rx="3" ry="3" width="80" height="8" />
    <Rect x="20" y="40" rx="3" ry="3" width="40" height="8" />
    <Rect x="20" y="60" rx="3" ry="3" width="60" height="8" />
    <Rect x="245" y="20" rx="3" ry="3" width="80" height="8" />
    <Rect x="285" y="40" rx="3" ry="3" width="40" height="8" />
    <Rect x="265" y="60" rx="3" ry="3" width="60" height="8" />
    <Rect x="0" y="100" rx="3" ry="3" width="347" height="85" />
    <Rect x="20" y="120" rx="3" ry="3" width="80" height="8" />
    <Rect x="20" y="140" rx="3" ry="3" width="40" height="8" />
    <Rect x="20" y="160" rx="3" ry="3" width="60" height="8" />
    <Rect x="245" y="120" rx="3" ry="3" width="80" height="8" />
    <Rect x="285" y="140" rx="3" ry="3" width="40" height="8" />
    <Rect x="265" y="160" rx="3" ry="3" width="60" height="8" />
  </ContentLoader>
);

export default AppointmentLoader;
