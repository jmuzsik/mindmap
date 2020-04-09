import React, { useEffect } from "react";

import "./FourOFour.css";

export default function FourOFour() {
  // let [componentDidMount, setComponentDidMount] = useState(false);
  // let [count, changeCount] = useState(0)
  // TODO: Make the 404 animation work
  useEffect(() => {
    // console.log('hi')
    // setTimeout(() => {
    //   window.anime
    //     .timeline({ loop: false })
    //     .add({
    //       targets: ".fly-in .fly-in-text",
    //       scale: [14, 1],
    //       opacity: [0, 1],
    //       easing: "easeOutCirc",
    //       duration: 800,
    //       delay: function(el, i) {
    //         console.log(i)
    //         return 800 * i;
    //       },
    //     })
    //     .add({
    //       targets: ".fly-in",
    //       opacity: 0,
    //       duration: 1000,
    //       easing: "easeOutExpo",
    //       delay: 1000,
    //     });
    //     if (componentDidMount === false) {
    //       setComponentDidMount(true);
    //     }
    // }, 2000)
  }, []);
  return (
    <div className="four-o-four">
      <h1 className="fly-in">
        <span className="fly-in-text">4</span>
        <span className="fly-in-text">0</span>
        <span className="fly-in-text">4</span>
      </h1>
    </div>
  );
}
