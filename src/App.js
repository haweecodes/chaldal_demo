import React from "react";
import "./App.css";
let category = require("./categories.json");
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      items: [...category],
      catItems: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }
  handleChange(e) {
    this.setState({ value: e.target.value }, () => {});
  }
  handleSearch = event => {
    if (event.target.value !== "") {
      this.state.catItems.forEach(element => {
        if (
          element.Name.toLowerCase().includes(event.target.value.toLowerCase())
        ) {
          element["match"] = true;
        } else {
          if (element.hasOwnProperty("match")) {
            delete element.match;
          }
        }
        if (element.hasOwnProperty("child")) {
          element.child.forEach((el, i) => {
            if (
              el.Name.toLowerCase().includes(event.target.value.toLowerCase())
            ) {
              element["match"] = true;
              el["match"] = true;
            } else {
              if (el.hasOwnProperty("match")) {
                delete el.match;
                delete element.match;
              }
            }
            if (el.hasOwnProperty("child")) {
              el.child.forEach((ele, i) => {
                if (
                  ele.Name.toLowerCase().includes(
                    event.target.value.toLowerCase()
                  )
                ) {
                  element["match"] = true;
                  el["match"] = true;
                  ele["match"] = true;
                } else {
                  if (ele.hasOwnProperty("match")) {
                    delete ele.match;
                    delete el.match;
                    delete element.match;
                  }
                }
              });
            }
          });
        }
      });
    } else {
      this.setState(
        {
          catItems: [...this.state.items]
        },
        () => {}
      );
    }
  };

  componentWillMount() {
    this.state.items.sort((a, b) => {
      return a.ParentCategoryId - b.ParentCategoryId;
    });

    for (let index = 0; index < category.length; index++) {
      let item = this.state.items.pop(); //pop an item to add that to a parent

      if (item.ParentCategoryId !== 0) {
        //search for the parent of that popped item
        let parent = this.state.items.find(el => {
          return item.ParentCategoryId === el.Id;
        });
        if (parent !== undefined) {
          if (parent.hasOwnProperty("child")) {
            parent.child.push(item);
          } else {
            parent["child"] = [];
          }
        }
      } else {
        this.state.items.push(item);
      }
    }

    this.setState(
      {
        catItems: [...this.state.items]
      },
      () => {}
    );
  }
  render() {
    let array = [];
    if (this.state.value === "") {
      this.state.catItems.forEach((element, i) => {
        array.push(
          <li key={element.Name + " " + i} style={{ listStyleType: "none" }}>
            {element.Name}
          </li>
        );

        if (element.hasOwnProperty("child")) {
          element.child.forEach((el, i) => {
            array.push(
              <li
                key={el.Name + " " + i}
                style={{ marginLeft: "20px", listStyleType: "none" }}
              >
                {el.Name}
              </li>
            );
            if (el.hasOwnProperty("child")) {
              el.child.forEach((ele, i) => {
                array.push(
                  <li
                    key={ele.Name + " " + i}
                    style={{ marginLeft: "30px", listStyleType: "none" }}
                  >
                    {ele.Name}
                  </li>
                );
              });
            }
          });
        }
      });
    } else {
      this.state.catItems.forEach((element, i) => {
        if (element.hasOwnProperty("match")) {
          array.push(
            <li
              key={element.Name + " " + i}
              style={{ listStyleType: "none", backgroundColor: "yellow" }}
            >
              {element.Name}
            </li>
          );
        } else {
          array.push(
            <li key={element.Name + " " + i} style={{ listStyleType: "none" }}>
              {element.Name}
            </li>
          );
        }
        if (element.hasOwnProperty("child")) {
          element.child.forEach((el, i) => {
            if (el.hasOwnProperty("match")) {
              array.push(
                <li
                  key={el.Name + " " + i}
                  style={{
                    marginLeft: "20px",
                    listStyleType: "none",
                    backgroundColor: "yellow"
                  }}
                >
                  {el.Name}
                </li>
              );
            } else {
              array.push(
                <li
                  key={el.Name + " " + i}
                  style={{ marginLeft: "20px", listStyleType: "none" }}
                >
                  {el.Name}
                </li>
              );
            }

            if (el.hasOwnProperty("child")) {
              el.child.forEach((ele, i) => {
                if (ele.hasOwnProperty("match")) {
                  array.push(
                    <li
                      key={ele.Name + " " + i}
                      style={{
                        marginLeft: "30px",
                        listStyleType: "none",
                        backgroundColor: "yellow"
                      }}
                    >
                      {ele.Name}
                    </li>
                  );
                } else {
                  array.push(
                    <li
                      key={ele.Name + " " + i}
                      style={{ marginLeft: "30px", listStyleType: "none" }}
                    >
                      {ele.Name}
                    </li>
                  );
                }
              });
            }
          });
        }
      });
    }

    return (
      <div className="App">
        <input
          type="text"
          id="search"
          value={this.state.value}
          name="search"
          placeholder="search"
          onKeyDown={this.handleSearch}
          onChange={this.handleChange}
        />
        {array}
      </div>
    );
  }
}

export default App;
