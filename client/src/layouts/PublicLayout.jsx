import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div>
      <h2>Public Layout</h2>
      <Outlet />
    </div>
  );
}