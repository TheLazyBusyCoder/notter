import { React } from "react";
import { MdOutlineDelete } from "react-icons/md";
import { useState } from "react";
import Navbar from "../components/Navbar";
import "./Home.css";
import { FaPen } from "react-icons/fa";

import { useContext } from "react";
import { NoteContext, NoteProvider } from "../context/NoteContext";
import NoteClass from "../helper/NoteClass";

function Home() {
  return (
    <div className="home">
      <Navbar />
      <div className="content">
        <LeftSide />
        <RightSide />
      </div>
    </div>
  );
}

function LeftSide() {
  return (
    <div className="left_side">
      <MenuBar />
      <LeftBox />
    </div>
  );
}

function LeftBox() {
  const { notes, deleteANote } = useContext(NoteContext);
  return (
    <div className="left_list_box">
      {notes.map((e, i) => (
        <Heading index={e.id} key={e.id}>
          {e.title}
          <MdOutlineDelete
            onClick={() => {
              deleteANote(e.id);
            }}
            className="delete_icon"
          />
        </Heading>
      ))}
    </div>
  );
}

function Heading({ children, index }) {
  const { changeNote, currentNote } = useContext(NoteContext);
  let style = {};
  if (index == currentNote) {
    style["backgroundColor"] = "rgb(230,230,230)";
    style["color"] = "black";
    style["fontWeight"] = "bold";
    style["textDecoration"] = "underline";
  } else {
    style["backgroundColor"] = "white";
    style["color"] = "black";
  }
  return (
    <div
      onClick={(e) => {
        changeNote(index);
      }}
      style={style}
      className="left_heading"
    >
      {children}
    </div>
  );
}

function MenuBar() {
  const { addNotes, getLastID } = useContext(NoteContext);
  return (
    <div className="menu_bar">
      <input className="input" placeholder="Search" />
      <FaPen
        onClick={(e) => {
          let title = prompt("Enter title");
          let id = getLastID();
          addNotes(new NoteClass(id, title, []));
        }}
        className="add_icon"
      />
    </div>
  );
}

function ModalTextArea() {
  const { setModalVis, text, setText, insertNoteV1, setType } = useContext(NoteContext);
  return (
    <div className="modal">
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
        }}
        placeholder="Enter Text Here"
        className="text_input"
      ></textarea>
      <div>
        <button
          onClick={() => {
            insertNoteV1();
          }}
        >
          save
        </button>
        <button
          onClick={() => {
            setText("");
            setModalVis(false);
          }}
        >
          discard
        </button>
      </div>
    </div>
  );
}

function RightSide() {
  const { notes, currentNote, modalVis } = useContext(NoteContext);
  return (
    <div className="right_side">
      {!modalVis || <ModalTextArea />}
      {notes[currentNote] != null ? <MainMenu /> : ""}

      <div className="right_size_box">
        <Page />
      </div>
    </div>
  );
}

function MenuItems({ text, fun }) {
  return (
    <>
      <div onClick={fun} className="menu_items">
        {text}
      </div>
      <hr className="insert_menu_hr" />
    </>
  );
}

function InsertMenu2({ list }) {
  return (
    <div className="insert_menu2">
      {list.map(function (e, i) {
        return <MenuItems key={i} fun={e.fun} text={e.text} />;
      })}
    </div>
  );
}

function InsertMenu({ dis }) {
  const { insertNote, resetNote, undoButton, setModalVis, text: NoteText, setType } = useContext(NoteContext);
  const [visible, setVisible] = useState(false);
  const [curr, setCurr] = useState(0);

  const [imageSrc, setImageSrc] = useState(null);

  let list = [
    [
      {
        text: "Heading",
        fun: function () {
          dis(false);
          setModalVis(true);
          setType("h1");
        },
      },
      {
        text: "Paragraph",
        fun: function () {
          dis(false);
          setModalVis(true);
          setType("p");
        },
      },
    ],
    [
      {
        text: "Light",
        fun: function () {
          dis(false);
          setModalVis(true);
          setType("code_light");
        },
      },
      {
        text: "Dark",
        fun: function () {
          setModalVis(true);
          dis(false);
          setType("code_dark");
        },
      },
    ],
  ];

  return (
    <div className="insert_menu">
      {!visible || <InsertMenu2 list={list[curr]} />}
      <div
        className="menu_items"
        onClick={(e) => {
          setCurr(0);
          setVisible((e) => !e);
        }}
      >
        Text
      </div>
      <hr className="insert_menu_hr" />
      <div
        className="menu_items"
        onClick={(e) => {
          setCurr(1);
          setVisible((e) => !e);
        }}
      >
        Code Block
      </div>

      <hr className="insert_menu_hr" />
      <div
        className="menu_items"
        onClick={() => {
          document.getElementById("fileInput").click();
        }}
      >
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(event) => {
            const file = event.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setImageSrc(reader.result);
                let height = `${prompt("Enter height")}px`;
                let width = `${prompt("Enter width")}px`;
                dis(false);
                insertNote(<img src={reader.result} alt="Selected" style={{ marginTop: "10px", height, width }} />);
              };
              reader.readAsDataURL(file);
            }
          }}
        />
        Image
      </div>
      <hr className="insert_menu_hr" />
      <div
        className="menu_items"
        onClick={function () {
          dis(false);
          insertNote(<hr className="insert_menu_hr" />);
        }}
      >
        Line
      </div>
      <hr className="insert_menu_hr" />
      <div
        className="menu_items"
        onClick={() => {
          let link = prompt("Enter link");
          let text = prompt("Enter prompt");
          dis(false);
          insertNote(
            <div>
              <a target="_blank" href={link}>
                {text}
              </a>
            </div>
          );
        }}
      >
        Link
      </div>
      <hr className="insert_menu_hr" />
    </div>
  );
}

function MainMenu() {
  const { saveNotes, resetNote, undoButton, setType } = useContext(NoteContext);

  const [visible, setVisible] = useState(false);
  return (
    <div className="main_menu">
      <div className="button_div">
        {!visible || <InsertMenu dis={setVisible} />}
        <div
          className="insert_menu_button"
          onClick={(e) => {
            setVisible((e) => !e);
          }}
        >
          Insert
        </div>
        <button
          onClick={() => {
            resetNote();
          }}
        >
          Reset
        </button>
        <button
          onClick={() => {
            undoButton();
          }}
        >
          Undo
        </button>
        <button
          onClick={() => {
            alert("Notes Saved");
            saveNotes();
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}

function Page() {
  const { notes, currentNote } = useContext(NoteContext);
  return notes[currentNote] != null ? (
    <div className="page">{notes[currentNote].notes.map((e) => e)}</div>
  ) : (
    <div style={{ color: "white", fontSize: "2rem" }}>No Data</div>
  );
}

export default Home;
