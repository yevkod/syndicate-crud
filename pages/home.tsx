import { useEffect, useState } from "react";
import { database } from "../firebaseConfig";
import { useRouter } from "next/navigation";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

export default function Home() {
  const [ID, setID] = useState(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isDone, setIsDone] = useState<boolean>(false);
  const [fireData, setFireData] = useState<any[]>([]);
  const [isUpdated, setIsUpdated] = useState<boolean>(false);
  const databaseRef = collection(database, "Auth Nextjs");

  const router = useRouter();

  useEffect(() => {
    router.push('/home');
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem("Token");
    token ? getData() : router.push("/register");
  }, []);

  const addData = () => {
    addDoc(databaseRef, {
      title: title,
      description: description,
      createdAt: serverTimestamp(),
    })
      .then(() => {
        alert("Task Added");
        setTitle("");
        getData();
        setDescription("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getData = async () => {
    await getDocs(databaseRef).then((response) => {
      setFireData(
        response.docs.map((data: any) => {
          return { ...data.data(), id: data.id };
        })
      );
    });
  };

  const getID = (
    id: any,
    title: string,
    description: string,
    isDone: boolean
  ) => {
    setID(id);
    setTitle(title);
    setDescription(description);
    setIsUpdated(true);
    setIsDone(isDone);
  };

  const updateFields = () => {
    // @ts-ignore
    let fieldToEdit = doc(database, "Auth Nextjs", ID);
    updateDoc(fieldToEdit, {
      title: title,
      description: description,
      isDone: isDone,
    })
      .then(() => {
        alert("Updated");
        getData();
        setTitle("");
        setDescription("");
        setIsUpdated(false);
        setIsDone(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteDocument = (id: number) => {
    // @ts-ignore
    let fieldToEdit = doc(database, "Auth Nextjs", id);
    deleteDoc(fieldToEdit)
      .then(() => {
        alert("Task Deleted");
        getData();
      })
      .catch((error) => {
        alert("Cannot delete task");
      });
  };

  const logOut = () => {
    sessionStorage.removeItem("Token");
    router.push("/register");
  };

  const markTaskAsDone = (id: number) => {
    // @ts-ignore
    const fieldToEdit = doc(database, "Auth Nextjs", id);
    const task = fireData.find((item) => item.id === id);

    if (task) {
      const updatedIsDone = !task.isDone;
      updateDoc(fieldToEdit, {
        isDone: updatedIsDone,
      })
        .then(() => {
          alert(`Task marked as ${updatedIsDone ? "Done" : "Not Done"}`);
          getData();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div onClick={logOut} className="relative">
          <button className="absolute bg-blue-500 text-white p-2 rounded w-[90px] bottom-1 right-0">
            Log Out
          </button>
        </div>
        <h1>Home</h1>
        <input
          placeholder="Title"
          type="text"
          value={title}
          onChange={(e: any) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          placeholder="Description"
          type="text"
          value={description}
          onChange={(e: any) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
        />

        {isUpdated ? (
          <button
            className="bg-blue-500 text-white p-2 rounded w-full"
            onClick={updateFields}
          >
            Update
          </button>
        ) : (
          <button
            className="bg-blue-500 text-white p-2 mt-2 rounded w-full"
            onClick={addData}
          >
            Add
          </button>
        )}

        {fireData.map((item) => (
          <div key={item.id}>
            <h3 className={`text-center ${item.isDone ? "line-through" : ""}`}>
              Title:{item.title}
            </h3>
            <p className={`text-center ${item.isDone ? "line-through" : ""}`}>
              Description:{item.description}
            </p>
            <p className={`text-center ${item.isDone ? "line-through" : ""}`}>
              Created at:{" "}
              {item.createdAt && item.createdAt instanceof Timestamp
                ? item.createdAt.toDate().toLocaleString(undefined, {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "N/A"}
            </p>{" "}
            <button
              className="bg-blue-500 text-white p-2 rounded w-full mt-2"
              onClick={() =>
                getID(item.id, item.title, item.description, item.isDone)
              }
            >
              Edit
            </button>
            <button
              className={`bg-blue-500 text-white p-2 rounded w-full mt-2`}
              onClick={() => markTaskAsDone(item.id)}
            >
              {item.isDone ? "Mark as Not Done" : "Mark as Done"}
            </button>
            <button
              data-testid="delete-button"
              className="bg-blue-500 text-white p-2 rounded w-full mt-2"
              onClick={() => deleteDocument(item.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
