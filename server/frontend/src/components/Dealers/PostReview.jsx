import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';
import "./PostReview.css"


const PostReview = () => {
  const [dealer, setDealer] = useState({});
  const [review, setReview] = useState("");
  const [model, setModel] = useState();
  const [year, setYear] = useState("");
  const [date, setDate] = useState("");
  const [carmodels, setCarmodels] = useState([]);

  let curr_url = window.location.href;
  let root_url = curr_url.substring(0,curr_url.indexOf("postreview"));
  let params = useParams();
  let id =params.id;
  let dealer_url = root_url+`djangoapp/dealer/${id}`;
  let review_url = root_url+`djangoapp/add_review`;
  let carmodels_url = root_url+`djangoapp/get_cars`;

  const postreview = async ()=>{
    let name = sessionStorage.getItem("firstname")+" "+sessionStorage.getItem("lastname");
    //If the first and second name are stores as null, use the username
    if(name.includes("null")) {
      name = sessionStorage.getItem("username");
    }
    if(!model || review === "" || date === "" || year === "" || model === "") {
      alert("All details are mandatory")
      return;
    }

    let model_split = model.split(" ");
    let make_chosen = model_split[0];
    let model_chosen = model_split[1];

    let jsoninput = JSON.stringify({
      "name": name,
      "dealership": id,
      "review": review,
      "purchase": true,
      "purchase_date": date,
      "car_make": make_chosen,
      "car_model": model_chosen,
      "car_year": year,
    });

    console.log(jsoninput);
    const res = await fetch(review_url, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: jsoninput,
  });

  const json = await res.json();
  if (json.status === 200) {
      window.location.href = window.location.origin+"/dealer/"+id;
  }

  }
  const get_dealer = async ()=>{
    const res = await fetch(dealer_url, {
      method: "GET"
    });
    const retobj = await res.json();
    
    if(retobj.status === 200) {
      let dealerobjs = Array.from(retobj.dealer)
      if(dealerobjs.length > 0)
        setDealer(dealerobjs[0])
    }
  }

  const get_cars = async () => {

    try {
        const res = await fetch(carmodels_url, {
        method: "GET"
        });

        const retobj = await res.json();
    
        let carmodelsarr = Array.from(retobj.CarModels)
        setCarmodels(carmodelsarr)
    } catch (err) {
        console.error("Failed to fetch car models:", err);
    }

  }


  useEffect(() => {
    get_dealer();
    get_cars();
  },[]);


  return (
    <div className="review-container">
  <Header />
  <br />
  <div className="form-wrapper">
    <h1 className="dealer-name">{dealer.full_name}</h1>

    <div className="input-group">
      <label htmlFor="review">Your Review</label>
      <textarea
        id="review"
        rows="7"
        placeholder="Write your experience here..."
        onChange={(e) => setReview(e.target.value)}
      ></textarea>
    </div>

    <div className="input-group">
      <label htmlFor="purchase-date">Purchase Date</label>
      <input
        type="date"
        id="purchase-date"
        onChange={(e) => setDate(e.target.value)}
      />
    </div>

    <div className="input-group">
      <label htmlFor="car-model">Car Make & Model</label>
      <select
        id="car-model"
        defaultValue=""
        onChange={(e) => setModel(e.target.value)}
      >
        <option value="" disabled>Choose Car Make and Model</option>
        {carmodels.map((carmodel, index) => (
          <option key={index} value={`${carmodel.CarMake} ${carmodel.CarModel}`}>
            {carmodel.CarMake} {carmodel.CarModel}
          </option>
        ))}
      </select>
    </div>

    <div className="input-group">
      <label htmlFor="car-year">Car Year</label>
      <input
        type="number"
        id="car-year"
        min="2015"
        max="2023"
        placeholder="e.g., 2020"
        onChange={(e) => setYear(e.target.value)}
      />
    </div>

    <button className="post-review-btn" onClick={postreview}>
      Post Review
    </button>
  </div>
</div>
  )
}

export default PostReview
