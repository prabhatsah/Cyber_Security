import { Avatar, AvatarFallback, AvatarImage } from "@/shadcn/ui/avatar";
import Skeleton from "./CustomSkeleton";
import { chatPropTypes, helpFromAIProps } from "../type";
import { Input } from "@/shadcn/ui/input";
import { useRef, useState } from "react";
import { useLowCodeNoCodeContext } from "../context/LowCodeNoCodeContext";
import { Button } from "@/shadcn/ui/button";
import { Send } from "lucide-react";
import { executePrompt } from "../../utils/preloader_functions";
import { v4 } from "uuid";
import Image from "next/image";
import { Card, CardContent } from "@/shadcn/ui/card";
import { CardFooter } from "@progress/kendo-react-layout";
import botImage from '../../assets/bot-image.png'

export default function HelpFromAITemplate({
    chats
}: helpFromAIProps) {
    const [query, setQuery] = useState<string|null>(null)
    const postQueryBtnRef = useRef<HTMLButtonElement>(null)
    const { chats:chats_,setChats } = useLowCodeNoCodeContext()

    return (
        <div className="h-[84vh]">
            <div className="border-2 border-gray-600 rounded-md p-4 h-full overflow-y-auto">
                {chats.length?
                chats.map((chat: chatPropTypes, index: number) => {
                    return (
                        <div className="space-y-2 mt-2">

                            <div className="w-full flex justify-end overflow-x-hidden">
                                <div className="flex gap-2 justify-end">
                                    <p className="bg-primary text-primary-foreground rounded-md p-2">
                                        {chat.query}
                                    </p>
                                    <Avatar>
                                        <AvatarImage src="https://github.com/shadcn.png" alt="@user" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </div>

                            </div>

                            <div className="w-full flex justify-start overflow-x-hidden">
                                {
                                    chat.gotReponse ?
                                        <div className="flex gap-2">
                                            <Avatar>
                                                <AvatarImage src="https://img.freepik.com/free-vector/cartoon-style-robot-vectorart_78370-4103.jpg?ga=GA1.1.738908217.1736405352&semt=ais_country_boost&w=740" alt="@user" />
                                                <AvatarFallback>CN</AvatarFallback>
                                            </Avatar>
                                            <p className="bg-muted rounded-md p-2">

                                                {
                                                chat.response
                                                }

                                                

                                            </p>

                                        </div>
                                        : <Skeleton />
                                }

                            </div>
                        </div>
                    )
                }):
                    <Card className="h-full flex flex-col justify-between">
                        <CardContent className="flex-grow flex items-center justify-center">
                            <Image
                                src={botImage}
                                alt="@bot-image"
                                width={300}
                                height={300}
                                className="object-contain"
                            />
                        </CardContent>
                        
                    </Card>
                
                }
                
            </div>

            <div className="w-full flex justify-end gap-2 mt-2 items-center">

                <Input placeholder="Ask anything..." className="w-full mt-4" onChange={(event)=>{
                    debugger
                    setQuery(event.target.value)
                    
                }} value={query} />

                <Button ref={postQueryBtnRef} disabled={query ? query.length === 0 : true} onClick={
                    () => {
                        debugger

                        //call the function to post query to AI
                        const cnv_Id = v4()

                        setChats([...chats_, {
                            query: query,
                            response: null,
                            gotReponse: false,
                            conversationId: cnv_Id,
                        }])

                        executePrompt('1727335330047', {

                            placeholderMap: {
                                userRequirement: query
                            }

                        }, (queryAns: string) => {
                            console.log('AI response received')
                            setChats((prevChats: chatPropTypes[]) => {
                                debugger
                                return prevChats.map((chat: chatPropTypes, index: number) => {
                                    if (chat.conversationId === cnv_Id) {
                                        return {
                                            ...chat,
                                            response: queryAns,
                                            gotReponse: true,
                                        }
                                    }
                                    return chat
                                })
                            })

                            setQuery('') //reset the input value
                        })
                    }
                } className="mt-3"><Send /></Button>

            </div>

        </div>
    )
}