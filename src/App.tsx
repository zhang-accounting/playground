import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {greet, parse} from "zhang-wasm";
import '@mantine/core/styles.css';
import {Badge, Chip, Combobox, Container, Grid, Group, rem, Tabs, Text, Textarea} from "@mantine/core";
import {IconAt, IconCheck, IconMessageCircle, IconPhoto, IconSettings, IconX} from '@tabler/icons-react';
import JsonView from '@uiw/react-json-view';
import {useLocalStorage} from '@mantine/hooks';
import CodeMirror from '@uiw/react-codemirror';

function App() {
    const [content, setContent] = useLocalStorage({key: 'ZHANG-PLAYGROUND-CONTENT', defaultValue: ''});

    const parseResult = parse(content);
    console.log("playground resuld", parseResult);
    console.log("playground resuld, zhang ", parseResult.zhang);
    console.log("playground resuld, zhang ", parseResult.zhang.store());

    // console.log("playground resuld, zhang() ",  parseResult.zhang_parse_result());
    let passIcon = <IconCheck style={{width: rem(12), height: rem(12)}}/>;
    let failIcon = <IconX style={{width: rem(12), height: rem(12)}}/>;
    return (

        <Container fluid>
            <Group py={"lg"}>
                <Text
                    size={rem(40)}
                    fw={900}
                    variant="gradient"
                    gradient={{from: 'cyan', to: 'blue', deg: 90}}
                >Zhang Playground</Text>
                <Badge leftSection={parseResult.zhang.pass() ? passIcon : failIcon}
                       color={parseResult.zhang.pass() ? "blue" : "red"}>Zhang</Badge>
                <Badge leftSection={parseResult.beancount.pass() ? passIcon : failIcon}
                       color={parseResult.beancount.pass() ? "blue" : "red"}>Beancount</Badge>

            </Group>

            <Tabs variant="outline" defaultValue="playground">
                <Tabs.List>
                    <Tabs.Tab value="playground" leftSection={<IconPhoto/>}>
                        Playground
                    </Tabs.Tab>
                    <Tabs.Tab value="gallery" leftSection={<IconPhoto/>}>
                        Gallery
                    </Tabs.Tab>
                    <Tabs.Tab value="messages" leftSection={<IconMessageCircle/>}>
                        Messages
                    </Tabs.Tab>

                    {
                        parseResult.zhang.pass() &&
                        <Tabs.Tab value="zhang_store" leftSection={<IconSettings/>}>
                            Zhang Store
                        </Tabs.Tab>
                    }
                    {
                        parseResult.beancount.pass() &&
                        <Tabs.Tab value="beancount_store" leftSection={<IconSettings/>}>
                            Beancount Store
                        </Tabs.Tab>
                    }

                </Tabs.List>

                <Tabs.Panel value="playground" py={"xs"} style={{minHeight: "80vh"}}>
                    <CodeMirror
                        value={content}
                        height="80vh"
                        width="100%"
                        onChange={(value) => {
                            setContent(value);
                        }}
                    />
                </Tabs.Panel>

                <Tabs.Panel value="gallery" py={"xs"}>
                    Gallery tab content
                </Tabs.Panel>

                <Tabs.Panel value="messages" py={"xs"}>
                    Messages tab content
                </Tabs.Panel>
                {
                    parseResult.zhang.pass() &&
                    <Tabs.Panel value="zhang_store" py={"xs"}>
                        <JsonView value={parseResult.zhang.store()} collapsed/>
                    </Tabs.Panel>
                }
                {
                    parseResult.beancount.pass() &&
                    <Tabs.Panel value="beancount_store" py={"xs"}>
                        <JsonView value={parseResult.beancount.store()} collapsed/>

                    </Tabs.Panel>
                }

            </Tabs>
        </Container>
    );
}

export default App;
