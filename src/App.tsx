import Footer from "./components/Footer";
import HabitList from "./components/HabitList";
import Header from "./components/Header";
import "./index.css";
import "./Fonts.css";
const App = () => {
  return (
    <div className="w-full h-screen flex flex-col justify-between mx-auto font-bold text-2xl ">
      <div>
        <Header />
        <HabitList />
      </div>
      <Footer />
    </div>
  );
};

export default App;
