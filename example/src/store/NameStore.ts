import { observable } from "react-observing"

export const NameStore = observable([{
    fistName: observable("My fist name"),
    lastName: observable("My last name"),
    genre: observable("My genere"),
    age: observable("My age"),
}]);
