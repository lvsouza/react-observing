import { observe } from "react-observing"

export const NameStore = observe([{
    show: observe(() => console.log('Try')),
    fistName: observe(""),
    lastName: observe(""),
    genre: observe(""),
    age: observe("")
}]);
