import { observe } from "react-observing"

export const NameStore = observe([{
    fistName: observe(""),
    lastName: observe(""),
    genre: observe(""),
    age: observe(""),
}]);
