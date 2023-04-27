import { PreventableBaklavaEvent } from "@baklavajs/events";
import outputStore from "./outputStore";
const beforeOutputAdded = new PreventableBaklavaEvent<string, null>(null);

const token = Symbol();
beforeOutputAdded.subscribe(token, (data, prevent) => {
    
    if (data === "prevent me") {
        prevent();
        return;
    }
    console.log(data);
});

function emit(data: string) {
    if (ev.emit(data)) {
        console.log("prevented");
    }
}

emit("prevent me");
emit("this works");