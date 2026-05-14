// "use client";
// import React, { useEffect, useState } from "react";
// import { useUser } from "@clerk/nextjs";
// import { useQuery, useMutation } from "convex/react";

// import { UserDetail, UserDetailContext } from "@/context/UserDetailContext";
// import { OnSaveContext } from "@/context/OnSaveContext";
// import { api } from "@/convex/_generated/api";

// function Provider({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   const { user, isSignedIn } = useUser();
//   const [overrideUserDetail, setOverrideUserDetail] =
//     useState<UserDetail | null>(null);
//   const [onSaveData, setOnSaveData] = useState<unknown>(null);

//   const currentUserDetail = useQuery(api.users.get);
//   const syncProfile = useMutation(api.users.syncProfile);

//   // Sync user profile data from Clerk to Convex
//   useEffect(() => {
//     if (!user || !currentUserDetail) return;

//     // Strong type assertion to prevent syllabusContent pollution
//     const userData = currentUserDetail as unknown as UserDetail | null;

//     const needsSync =
//       (user.imageUrl && user.imageUrl !== userData?.imageUrl) ||
//       (user.fullName && user.fullName !== userData?.name);

//     if (needsSync && userData?._id) {
//       syncProfile({
//         name: user.fullName || undefined,
//         imageUrl: user.imageUrl || undefined,
//       }).catch(console.error);
//     }
//   }, [user, currentUserDetail, syncProfile]);

//   // Final safe cast
//   const userDetail: UserDetail | null =
//     overrideUserDetail ?? (currentUserDetail as unknown as UserDetail | null) ?? null;

//   useEffect(() => {
//     if (!isSignedIn && overrideUserDetail !== null) {
//       const id = setTimeout(() => setOverrideUserDetail(null), 0);
//       return () => clearTimeout(id);
//     }
//   }, [isSignedIn, overrideUserDetail]);

//   return (
//     <UserDetailContext.Provider
//       value={{ userDetail, setUserDetail: setOverrideUserDetail }}
//     >
//       <OnSaveContext.Provider value={{ onSaveData, setOnSaveData }}>
//         {children}
//       </OnSaveContext.Provider>
//     </UserDetailContext.Provider>
//   );
// }

// export default Provider;



"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";

import { UserDetail, UserDetailContext } from "@/context/UserDetailContext";
import { OnSaveContext } from "@/context/OnSaveContext";
import { api } from "@/convex/_generated/api";

function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, isSignedIn } = useUser();
  const [overrideUserDetail, setOverrideUserDetail] =
    useState<UserDetail | null>(null);
  const [onSaveData, setOnSaveData] = useState<unknown>(null);

  const currentUserDetail = useQuery(api.users.get);
  const syncProfile = useMutation(api.users.syncProfile);
  const createOrGetUser = useMutation(api.users.createOrGet);   // ← Added

  // Create user if not exists
  useEffect(() => {
    if (isSignedIn && user) {
      createOrGetUser({}).catch(console.error);
    }
  }, [isSignedIn, user, createOrGetUser]);

  // Sync user profile data from Clerk to Convex
  useEffect(() => {
    if (!user || !currentUserDetail) return;

    const userData = currentUserDetail as unknown as UserDetail | null;

    const needsSync =
      (user.imageUrl && user.imageUrl !== userData?.imageUrl) ||
      (user.fullName && user.fullName !== userData?.name);

    if (needsSync && userData?._id) {
      syncProfile({
        name: user.fullName || undefined,
        imageUrl: user.imageUrl || undefined,
      }).catch(console.error);
    }
  }, [user, currentUserDetail, syncProfile]);

  const userDetail: UserDetail | null =
    overrideUserDetail ?? (currentUserDetail as unknown as UserDetail | null) ?? null;

  useEffect(() => {
    if (!isSignedIn && overrideUserDetail !== null) {
      const id = setTimeout(() => setOverrideUserDetail(null), 0);
      return () => clearTimeout(id);
    }
  }, [isSignedIn, overrideUserDetail]);

  return (
    <UserDetailContext.Provider
      value={{ userDetail, setUserDetail: setOverrideUserDetail }}
    >
      <OnSaveContext.Provider value={{ onSaveData, setOnSaveData }}>
        {children}
      </OnSaveContext.Provider>
    </UserDetailContext.Provider>
  );
}

export default Provider;