import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={{ padding: '1rem' }}>
      <h1 style={{ marginLeft: '43% ' }}>YuktiVerse</h1>
      <p style={{ marginLeft: '45% ' }}>Coming soon ...</p>
          <img src="../assets/750003cb-fc39-41be-a28a-be393bf1013a.jpg" alt="" />
      <Link to= "/work/academic-org">
        academi
      </Link>
    </div>
  );
}

export default Home;