import firebase from "firebase";
import { createContext, ReactNode, useEffect, useState } from "react";
import { auth } from "../services/firebase";
import ligth from "../styles/themes/ligth";
import dark from "../styles/themes/ligth";

type IUser = {
  id: string;
  name: string;
  avatar: string;
};
type AuthContextType = {
  user: IUser | undefined;
  signInWithGoogle: () => Promise<void>;
  // toggleTheme: () => void;
};
type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {
  const [user, setUser] = useState<IUser>();
  // const [theme, setTheme] = useState(ligth)

  // const toggleTheme = () =>{
  //   setTheme(theme.title === 'ligth'? dark: ligth)
  // }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const { displayName, photoURL, uid } = user;

        if (!displayName || !photoURL) {
          throw new Error("Missing informatino from Google Account");
        }
        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL,
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await auth.signInWithPopup(provider);

    if (result.user) {
      const { displayName, photoURL, uid } = result.user;

      if (!displayName || !photoURL) {
        throw new Error("Missing informatino from Google Account");
      }
      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL,
      });
    }
  }
  return (
    <AuthContext.Provider value={{ 
      user, 
      signInWithGoogle
      //  toggleTheme 
       }}>
      {props.children}
    </AuthContext.Provider>
  );
}
