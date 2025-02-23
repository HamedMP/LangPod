"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

interface SidebarContextType {
  userCourseId?: string;
  courseName?: string;
  updateSidebarInfo: (info: {
    userCourseId?: string;
    courseName?: string;
  }) => void;
}

const SidebarContext = createContext<SidebarContextType>({
  updateSidebarInfo: () => {},
});

export function SidebarContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userCourseId, setUserCourseId] = useState<string>();
  const [courseName, setCourseName] = useState<string>();

  const updateSidebarInfo = useCallback(
    (info: { userCourseId?: string; courseName?: string }) => {
      setUserCourseId(info.userCourseId);
      setCourseName(info.courseName);
    },
    []
  );

  useEffect(() => {
    const lastActiveUserCourse = localStorage.getItem("lastActiveUserCourse");
    if (lastActiveUserCourse) {
      setUserCourseId(lastActiveUserCourse);
    }
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        userCourseId,
        courseName,
        updateSidebarInfo,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebar = () => useContext(SidebarContext);
