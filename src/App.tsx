import React from 'react';
import './App.css';
import {parse} from "zhang-wasm";
import '@mantine/core/styles.css';
import {Alert, Badge, Button, Container, Group, rem, Stack, Tabs, Text} from "@mantine/core";
import {IconCheck, IconInfoCircle, IconPhoto, IconSettings, IconX} from '@tabler/icons-react';
import JsonView from '@uiw/react-json-view';
import {useLocalStorage} from '@mantine/hooks';
import CodeMirror from '@uiw/react-codemirror';


const defualtContent = `
option "title" "My Accounting"
option "operating_currency" "CNY"

1970-01-01 open Assets:BankCard CNY

1970-01-01 open Expenses:Food CNY

2023-12-02 "KFC" "VME50 Package"
  Assets:BankCard -50 CNY
  Expenses:Food
`

function App() {
    const [content, setContent] = useLocalStorage({key: 'ZHANG-PLAYGROUND-CONTENT', defaultValue: defualtContent});

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
                    <Stack>
                        <Group><Button variant="default" onClick={() => setContent(defualtContent)}>Set as default
                            content</Button>
                        </Group>
                        {!parseResult.zhang.pass() &&
                            <Alert py={"xs"} variant="light" color="red" title="Zhang parse message"
                                   icon={<IconInfoCircle/>}>
                                {parseResult.zhang.msg()}
                            </Alert>
                        }
                        {!parseResult.beancount.pass() &&
                            <Alert py={"xs"} variant="light" color="red" title="Beancount parse message"
                                   icon={<IconInfoCircle/>}>
                                {parseResult.beancount.msg()}
                            </Alert>
                        }

                        <CodeMirror
                            value={content}
                            height="80vh"
                            width="100%"
                            onChange={(value) => {
                                setContent(value);
                            }}
                        />
                    </Stack>
                </Tabs.Panel>
                {
                    parseResult.zhang.pass() &&
                    <Tabs.Panel value="zhang_store" py={"xs"}>
                        <JsonView value={parseResult.zhang.store()} collapsed={1}/>
                    </Tabs.Panel>
                }
                {
                    parseResult.beancount.pass() &&
                    <Tabs.Panel value="beancount_store" py={"xs"}>
                        <JsonView value={parseResult.beancount.store()} collapsed={1}/>
                    </Tabs.Panel>
                }
            </Tabs>
        </Container>
    );
}

export default App;
