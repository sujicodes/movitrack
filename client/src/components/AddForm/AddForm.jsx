import React, { useState } from "react";
import { Collapse } from "@mui/material"
import IconButton from '@mui/material/IconButton';
import axios from "axios";
import "./AddForm.css"

const ExpandMore = (props) => {
    const { expand, ...other } = props;
    console.log({...other})
    return <IconButton {...other} />;
  };

function AddForm({type, fetch}){
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
      };

    const [movie, setMovie] = useState({
          name:"",
          year:"",
          type: type,
        });

    function textChanged(event){
        const { value, name } = event.target;
        setMovie( prevItem =>({
            ...prevItem,
            [name]: value
        })
        )
        console.log(movie)
    }

    async function handleSubmit(event){
        event.preventDefault();
        try {
            const response = axios.post('http://localhost:5000/api/data', movie);
            if (response.status === 201) {
                await fetch();
            } else {
                console.error('Failed to add item');
              }
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

    return(
        <div>
            <ExpandMore
                expand={expanded}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
            >
                <img src="/images/plus.svg" alt="" width="50px" />
            </ExpandMore>
            <Collapse in={expanded}>
                <form id="movieForm" onSubmit={handleSubmit}>
                    <div>
                        <label for="name">Name: </label>
                        <input type="text" id="name" name="name" onChange={textChanged} required />
                    </div>
                    <div>
                        <label for="year">Year: </label>
                        <input type="text" id="year" name="year" onChange={textChanged}/>
                        <input type="submit" value="Add" />
                    </div>  
                </form>
            </Collapse>
        </div>
    )
}
export default AddForm;