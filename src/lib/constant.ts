// const colors=["a","b"] as const
// // type Name = "a" | "b"
// type Name=(typeof names)[number];
import {red,green} from "@mui/material/colors";

export const Colors={
    red:red["400"],
    green:green["300"],
} as const;
