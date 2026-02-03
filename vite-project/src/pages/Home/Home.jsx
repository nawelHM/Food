import React ,{useState} from 'react'
import './Home.css';
import Header from "../../components/Header/Header"
import ExplortMenu from './../../components/ExplorMenu/ExplortMenu';
import FoodDisplay from './../../components/FoodDisplay/FoodDisplay';
import AppDownload from './../../components/AppDownload/AppDownload';


function Home() {

const[category,setCategory]=useState("All")


  return (
    <div>
      <Header />
      <ExplortMenu category={category} setCategory={setCategory} />
      <FoodDisplay  category={category} />
      <AppDownload />
    </div>
  )
}

export default Home
