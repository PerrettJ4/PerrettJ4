// const html = (
//   <>
//     <div class="section" id="skills">
//       <h2>Skills</h2>
//       <div class="container">
//         <div class="card">
//           <div class="box">
//             <div class="percent">
//               <svg viewBox="32 -15 85 85">
//                 <circle cx="70" cy="70" r="70"></circle>
//                 <circle cx="70" cy="70" r="70"></circle>
//               </svg>
//               <div class="number">
//                 <h3>
//                   75<span>%</span>
//                 </h3>
//               </div>
//             </div>
//             <div class="skill-text">
//               <h3 class="text">Html</h3>
//             </div>
//           </div>
//         </div>
//         <div class="card">
//           <div class="box">
//             <div class="percent">
//               <svg viewBox="32 -15 85 85">
//                 <circle cx="70" cy="70" r="70"></circle>
//                 <circle cx="70" cy="70" r="70"></circle>
//               </svg>
//               <div class="number">
//                 <h3>
//                   80<span>%</span>
//                 </h3>
//               </div>
//             </div>
//             <div class="skill-text">
//               <h3 class="text">CSS</h3>
//             </div>
//           </div>
//         </div>
//         <div class="card">
//           <div class="box">
//             <div class="percent">
//               <svg viewBox="32 -15 85 85">
//                 <circle cx="70" cy="70" r="70"></circle>
//                 <circle cx="70" cy="70" r="70"></circle>
//               </svg>
//               <div class="number">
//                 <h3>
//                   84<span>%</span>
//                 </h3>
//               </div>
//             </div>
//             <div class="skill-text">
//               <h3 class="text">JS</h3>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   </>
// ).toString();

// window.setTimeout("chBackColor()", 10000);

function changecolor(skr) {
  skr.style.backgroundColor = "violet";
  skr.style.boxShadow = "0px 0px 5px mediumorchid";
}

const me = document.querySelector("#me");
function darkSideOfTheMoon() {
  document.documentElement.style.filter =
    document.documentElement.style.filter.includes("contrast")
      ? "invert(00%)"
      : "invert(100%) saturate(105%) contrast(110%) brightness(0.9)";
  me.style.filter = me.style.filter.includes("100%")
    ? "invert(0%)"
    : "invert(100%)";
  console.log(w, me);
}

// moon 5 second thing
const noti = document.querySelector("#hideDiv");

setTimeout(() => {
  noti.style.display = "none";
}, 500000);
