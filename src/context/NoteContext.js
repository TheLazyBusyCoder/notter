import { createContext, useState, useEffect } from "react";
import { React } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { solarizedlight, solarizedDarkAtom } from "react-syntax-highlighter/dist/esm/styles/prism";
import NoteClass from "../helper/NoteClass";

const NoteContext = createContext();

function CodeBlockLight({ codeString }) {
  return (
    <div className="code-block">
      <SyntaxHighlighter language="dart" style={solarizedlight}>
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
}

function CodeBlockDark({ codeString }) {
  return (
    <div className="code-block">
      <SyntaxHighlighter language="dart" style={solarizedDarkAtom}>
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
}

function NoteProvider({ children }) {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(0);
  const [modalVis, setModalVis] = useState(false);
  const [text, setText] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    const loadedArray = loadArrayFromLocalStorage();
    console.log(loadedArray);
    const new_notes = [];
    loadedArray.forEach((e) => {
      const data = new NoteClass(e.id, e.title, []);
      e.list.forEach((ee) => {
        if (ee.type == "h1") {
          data.notes.push(<h1 key={ee.data}>{ee.data}</h1>);
        } else if (ee.type == "p") {
          data.notes.push(<p key={ee.data}>{ee.data}</p>);
        } else if (ee.type == "code") {
          data.notes.push(<CodeBlockLight key={ee.data} codeString={ee.data} />);
        }
      });
      new_notes.push(data);
    });
    setNotes([...new_notes]);
  }, []);

  function changeNote(index) {
    setCurrentNote(index);
  }

  function addNotes(newNote) {
    setCurrentNote(newNote.id);
    setNotes([...notes, newNote]);
  }

  const loadArrayFromLocalStorage = () => {
    const jsonString = localStorage.getItem("notes");
    if (jsonString) {
      return JSON.parse(jsonString);
    }
    return [];
  };

  function insertNote(newNote) {
    notes[currentNote].notes = [...notes[currentNote].notes, newNote];
    setNotes([...notes]);
  }

  function insertNoteV1() {
    if (type === "h1") {
      insertNote(<h1 key={text}>{text}</h1>);
    } else if (type === "p") {
      insertNote(<p key={text}>{text}</p>);
    } else if (type === "code_light") {
      insertNote(<CodeBlockLight key={text} codeString={text} />);
    } else if (type === "code_dark") {
      insertNote(<CodeBlockDark key={text} codeString={text} />);
    }
    setText("");
    setModalVis(false);
  }

  function getLastID() {
    if (notes.length == 0) {
      return 0;
    } else {
      return notes.length;
    }
  }

  function resetNote() {
    notes[currentNote].notes = [];
    setNotes([...notes]);
  }

  function undoButton() {
    const newContent = [...notes[currentNote].notes];
    newContent.pop();
    notes[currentNote].notes = newContent;
    setNotes([...notes]);
  }

  function deleteANote(index) {
    const newNotes = notes.filter((note) => note.id !== index);
    setNotes(newNotes);
  }

  function saveNotes() {
    console.log(notes);
    const mainData = [];
    notes.forEach((e) => {
      const { id, title } = e;
      const temp = {};
      temp["id"] = id;
      temp["title"] = title;
      const temp_list = [];
      const list = e.notes;
      list.forEach((ee) => {
        let ttype = ee.type;
        let tdata = ee.props.children;
        if (tdata == undefined) {
          ttype = "code";
          tdata = ee.props.codeString;
          temp_list.push({ type: ttype, data: tdata });
        } else {
          temp_list.push({ type: ttype, data: tdata });
        }
      });
      temp["list"] = temp_list;
      mainData.push(temp);
    });
    const string_data = JSON.stringify(mainData);
    localStorage.setItem("notes", string_data);
  }

  return (
    <NoteContext.Provider
      value={{
        setType,
        insertNoteV1,
        text,
        setText,
        modalVis,
        setModalVis,
        deleteANote,
        changeNote,
        saveNotes,
        notes,
        setNotes,
        addNotes,
        currentNote,
        setCurrentNote,
        insertNote,
        getLastID,
        resetNote,
        undoButton,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
}

export { NoteContext, NoteProvider };
