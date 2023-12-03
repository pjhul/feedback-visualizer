"use client";

import { useState } from "react";
import { useChat } from "ai/react";

import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
  });

  return (
    <>
      <main className="flex flex-1 flex-col">
        <div className="relative flex h-[calc(100vh_-_146px)] flex-row overflow-hidden">
          {/* Chat */}
          <div className="animate-in group flex w-full flex-col justify-between overflow-auto bg-content1 pl-0 duration-300 ease-in-out peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]">
            <div className="pb-[200px] pt-4 md:pt-10">
              <div className="relative mx-auto max-w-2xl px-4">
                {/* Chat */}
                <div>
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className="group relative mb-4 flex items-start md:-ml-12"
                    >
                      {message.role === "assistant" ? (
                        <Avatar>
                          <AvatarImage
                            className="h-2"
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/240px-ChatGPT_logo.svg.png"
                          />
                          <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                      ) : (
                        <Avatar>
                          <AvatarImage
                            className="h-2"
                            src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png"
                          />
                          <AvatarFallback>User</AvatarFallback>
                        </Avatar>
                      )}
                      <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
                        <div className="prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 break-words">
                          {message.content}
                          <br className="mt-5" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="h-px w-full"></div>
            </div>
            <div>
              <form onSubmit={handleSubmit} className="grid w-full gap-2">
                <Textarea
                  color="success"
                  placeholder="Send a message"
                  value={input}
                  onChange={handleInputChange}
                />
                <Button type="submit" disabled={handleSubmit}>
                  Send message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default ChatPage;
