import { Card, CardContent, Typography } from "@mui/joy";
import { PropsWithChildren } from "react";

export default function CardBlock({ header, children }: PropsWithChildren<{ header: string }>) {
    return (<Card
        size="lg"
        color="primary"
        orientation="vertical"
        variant="soft">
        <Typography level="h4">{header}</Typography>
        <CardContent orientation="horizontal">
            <Typography level='h2'>
                {children}
            </Typography>
        </CardContent>
    </Card>);
}
