import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import JoditEditor from "jodit-react";
import Content from "./content";

// import Content from "./content";
// import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
// import Content from "./content";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [encodeContent, setEncodeContent] = useState("");
  const editor = useRef(null);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [isFullPage, setIsFullPage] = useState(false);
  // const encodedContent = "";
  const toggleFullPage = () => {
    setIsFullPage(!isFullPage);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // const handleEncoded = (content) => {
  //   const encodeContent = btoa(content);
  //   console.log(encodeContent);
  //   createNote(content= {encodeContent});
  // }

  const fetchNotes = () => {
    axios
      // .get("http://note.sqaa-online.com/api/notes")
      .get("http://localhost:4000/api/notes")
      .then((response) => {
        // Sort the notes array in descending order based on the created_at timestamp
        const sortedNotes = response.data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setNotes(sortedNotes);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const createNote = () => {
    if (!content) {
      alert("Please add content.");
      return;
    }

    axios
      .post("http://localhost:4000/api/note", { title, content })
      // .post("http://note.sqaa-online.com/api/note", { title, content })
      .then((response) => {
        console.log(response.data);
        fetchNotes();
        setTitle("");
        setContent("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const encode = btoa("Hello");
  console.log(encode);
  const decode = atob(encode);
  console.log(decode);

  const updateNote = () => {
    if (!content || content.trim() === "") {
      alert("Please add content.");
      return;
    }

    if (selectedNoteId) {
      axios
        .put(`http://localhost:4000/api/notes/update/${selectedNoteId}`, {
          // .put(`http://note.sqaa-online.com/api/notes/update/${selectedNoteId}`, {
          title,
          content,
        })
        .then((response) => {
          console.log(response.data);
          fetchNotes();
          setSelectedNoteId(null);
          setTitle("");
          setContent("");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const deleteNote = (id) => {
    axios
      // .delete(`http://note.sqaa-online.com/api/notes/delete/${id}`)
      .delete(`http://localhost:4000/api/notes/delete/${id}`)
      .then((response) => {
        console.log(response.data);
        fetchNotes();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const selectNote = (note) => {
    setSelectedNoteId(note.id);
    setTitle(note.title);
    setContent(note.content);
  };

  // Quill toolbar edit start
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };
  // const formats = [
  //   'header',
  //   'bold', 'italic', 'underline', 'strike', 'blockquote',
  //   'list', 'bullet', 'indent',
  //   'link', 'image'
  // ],
  // Quill toolbar edit end

  // const config = useMemo(
  //   {
  //     placeholder: 'Enter Content ...'
  //   }
  // )

  return (
    <div className="bg-[#202124] text-white pb-20 ">
      <h1 className="text-center text-3xl my-5 ">Note Taking App</h1>
      <div className=" flex flex-col justify-center items-center ">
        <form onSubmit={(e) => e.preventDefault()} className="w-1/2 mb-5">
          {/* <label class="text-sm  font-medium">From</label> */}
          <input
            type="text"
            placeholder="Enter Title"
            value={title}
            className="w-full mb-3 px-2 py-1.5 mt-1 block border border-gray-300 text-white rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none bg-[#202124]
          focus:border-white focus:ring-1 focus:ring-white focus:invalid:border-red-500 focus:invalid:ring-red-500"
            onChange={(e) => setTitle(e.target.value)}
          />
          {/* <label class="text-sm font-medium">Messages</label> */}
          <ReactQuill
            value={content}
            onChange={(value) => setContent(value)}
            modules={modules}
            // formats={formats}
            placeholder="Enter Content ..."
            className="   text-white border mb-5 placeholder:text-white "
          />

          {/* <JoditEditor
            ref={editor}
            value={content}
            // config={config}
            tabIndex={1} // tabIndex of textarea
            onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
            onChange={(newContent) => {}}
          /> */}

          {/* <textarea
            placeholder="Content"
            value={content}
            className="min-h-[120px] w-full mb-3 px-2 py-1.5 mt-1 block border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none
          focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:invalid:border-red-500 focus:invalid:ring-red-500"
            onChange={(e) => setContent(e.target.value)}
          ></textarea> */}
          <div className="text-center">
            {selectedNoteId ? (
              <button
                type="button"
                className="px-4 py-1.5 rounded-md shadow-lg bg-gradient-to-r from-pink-600 to-red-600 font-medium text-gray-100 block transition duration-300"
                onClick={updateNote}
              >
                Update Note
              </button>
            ) : (
              <button
                type="button"
                className="px-4 py-1.5 rounded-md shadow-lg bg-gradient-to-r from-pink-600 to-red-600 font-medium text-gray-100 inline-block transition duration-300"
                onClick={createNote}
              >
                Create Note
              </button>
            )}
          </div>
        </form>
      </div>
      <div className=" flex justify-center flex-wrap gap-4">
        {notes.map((note) => (
          <div
            key={note.id}
            className={`border border-[#5f6368] relative w-[360px] pb-8 rounded-md ${
              isFullPage ? "fixed top-0 left-0 w-full h-full bg-white z-50" : ""
            }`}
          >
            <h3 className="text-xl px-3 py-2 border-b border-b-[#5f6368] min-h-[40px] ">
              {note.title}
            </h3>
            <div className="h-[260px] overflow-auto px-3 pt-2 mb-7 ">
              <Content html={note.content} />
              {/* <p style={backgroundColor= 'red'} >fdskfjhsdfd</p> */}
              {/* <p className="px-3 ">{note.content}</p> */}
            </div>
            <div className=" bg-[#202124] rounded-md absolute border-t border-t-[#5f6368] bottom-0 px-5 flex justify-evenly w-full py-2 ">
              <button
                onClick={() => selectNote(note)}
                className="border border-[#5f6368] px-4 py-1 hover:bg-white hover:border-white hover:text-black rounded-md "
              >
                Edit
              </button>

              <button
                onClick={() => deleteNote(note.id)}
                className="border border-[#5f6368] px-4 py-1 hover:bg-white hover:border-white hover:text-black rounded-md "
              >
                Delete
              </button>
              <button
                onClick={toggleFullPage}
                className="border border-[#5f6368] px-4 py-1 hover:bg-white hover:border-white hover:text-black rounded-md "
              >
                Toggle Full Page
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
