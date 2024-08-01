import { Button, Item, ItemContent, ItemDescription, ItemExtra, ItemGroup, ItemHeader, ItemMeta, Label, List, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import { SyntheticEvent, useState } from "react";

interface Props {
    activities: Activity[];
    selectActivity: (id: string) => void;
    deleteActivity: (id:string)=> void;
    submitting: boolean;
}

export default function ActivityList({activities, selectActivity, deleteActivity, submitting}: Props) {
    const [target, setTarget] = useState('');
    function handleDeleteActivity(e: SyntheticEvent<HTMLButtonElement>, id: string) {
        setTarget(e.currentTarget.name);
        deleteActivity(id);
    }
    return (
        <Segment>
            <ItemGroup divided>
                {activities.map(activity => (<Item key={activity.id}>
                    <ItemContent>
                        <ItemHeader as='a'>{activity.title}</ItemHeader>
                        <ItemMeta >{activity.date}</ItemMeta>
                        <ItemDescription>
                            <div>{activity.description}</div>
                            <div>{activity.city}, {activity.venue}</div>
                        </ItemDescription>
                        <ItemExtra>
                            <Button onClick={ () => selectActivity(activity.id) } floated="right" content="View" color="blue"></Button>
                            <Button name={activity.id} loading={submitting && target===activity.id} onClick={ (e) => handleDeleteActivity(e, activity.id) } floated="right" content="Delete" color="red"></Button>
                            <Label basic content={activity.category}></Label>
                        </ItemExtra>
                    </ItemContent>
               
            </Item>))}
            </ItemGroup>
        </Segment>
    )
}