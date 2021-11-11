const html = (
  <>
    <div class="section" id="skills">
      <h2>Skills</h2>
      <div class="container">
        <div class="card">
          <div class="box">
            <div class="percent">
              <svg viewBox="32 -15 85 85">
                <circle cx="70" cy="70" r="70"></circle>
                <circle cx="70" cy="70" r="70"></circle>
              </svg>
              <div class="number">
                <h3>
                  75<span>%</span>
                </h3>
              </div>
            </div>
            <div class="skill-text">
              <h3 class="text">Html</h3>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="box">
            <div class="percent">
              <svg viewBox="32 -15 85 85">
                <circle cx="70" cy="70" r="70"></circle>
                <circle cx="70" cy="70" r="70"></circle>
              </svg>
              <div class="number">
                <h3>
                  80<span>%</span>
                </h3>
              </div>
            </div>
            <div class="skill-text">
              <h3 class="text">CSS</h3>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="box">
            <div class="percent">
              <svg viewBox="32 -15 85 85">
                <circle cx="70" cy="70" r="70"></circle>
                <circle cx="70" cy="70" r="70"></circle>
              </svg>
              <div class="number">
                <h3>
                  84<span>%</span>
                </h3>
              </div>
            </div>
            <div class="skill-text">
              <h3 class="text">JS</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
).toString();

const container = document.querySelector(".container");
container.innerHTML(html);
console.log(html);
