import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import {
  Link,
  HorizontalStack,
  Icon,
  Layout,
  LegacyCard,
} from "@shopify/polaris";
import { ChecklistMajor } from "@shopify/polaris-icons";
import iconWrapper from "../utilities/iconWrapper";

const TinyMCEEditor = () => {
  const [charCount, setCharCount] = useState(0);
  const [contentChunks, setContentChunks] = useState<string[]>([]);
  const [copiedChunkIndex, setCopiedChunkIndex] = useState<number | null>(null);
  const [nextChunkIndex, setNextChunkIndex] = useState(0);

  const stripTags = (html: string) => {
    return html.replace(/<\/?(p|div)(\s[^>]*)?>/gi, "");
  };

  const getChunks = (content: string, chunkSize: number) => {
    const chunks = [];
    let index = 0;

    while (index < content.length) {
      chunks.push(content.slice(index, index + chunkSize));
      index += chunkSize;
    }

    return chunks;
  };

  const handleEditorChange = (content: string) => {
    const strippedContent = stripTags(content);
    const charCount = strippedContent.length;
    const contentChunks = getChunks(strippedContent, 4000);

    setCharCount(charCount);
    setContentChunks(contentChunks);
    setNextChunkIndex(0);
    setCopiedChunkIndex(null);
  };

  const handleCopyClick = (chunk: string, index: number) => {
    navigator.clipboard.writeText(chunk).then(
      () => {
        console.log("Text copied to clipboard");
        setCopiedChunkIndex(index);
        setNextChunkIndex(index + 1);
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  };

  const handleSingleCopyClick = () => {
    if (nextChunkIndex < contentChunks.length) {
      const chunk = contentChunks[nextChunkIndex];
      handleCopyClick(chunk, nextChunkIndex);
      setNextChunkIndex(nextChunkIndex + 1);
    } else {
      console.log("All chunks have been copied");
    }
  };

  const CheckmarkIcon = iconWrapper(ChecklistMajor);

  return (
    <div>
      <h2>Character count: {charCount}</h2>
      <Layout>
        <Layout.Section>
          <Editor
            apiKey="c7u01oraso8zlyfjzy5rerv2flmsicg2ztv7csfy492ytuoa"
            init={{
              plugins:
                "advlist autolink lists link image charmap print preview anchor searchreplace visualblocks code fullscreen insertdatetime media table paste code help wordcount",
              toolbar:
                "undo redo | formatselect | bold italic backcolor | \
              alignleft aligncenter alignright alignjustify | \
              bullist numlist outdent indent | removeformat | help",
              toolbar_mode: "floating",
              wordcount: {
                display_word_count: true,
                display_char_count: true,
                count_spaces_as_chars: true,
                count_line_breaks: false,
              },
              forced_root_block: "",
              force_br_newlines: true,
              force_p_newlines: false,
              remove_linebreaks: false,
              convert_newlines_to_brs: false,
              remove_redundant_brs: false,
            }}
            onEditorChange={handleEditorChange}
          />
        </Layout.Section>
        <Layout.Section>
          <LegacyCard
            title="Copy Your Text"
            sectioned
            actions={[
              { content: "Copy Next Chunk", onAction: handleSingleCopyClick },
            ]}
          >
            <HorizontalStack gap="5">
              {contentChunks.map((chunk, index) => (
                <Link key={index} onClick={() => handleCopyClick(chunk, index)}>
                  {copiedChunkIndex === index ? (
                    <span style={{ color: "green" }}>
                      Chunk {index + 1} copied{" "}
                      <span
                        style={{
                          display: "inline-block",
                          margin: 0,
                        }}
                      >
                        <Icon source={CheckmarkIcon} />
                      </span>
                    </span>
                  ) : (
                    <>Copy chunk {index + 1}</>
                  )}
                </Link>
              ))}
            </HorizontalStack>
          </LegacyCard>
        </Layout.Section>
      </Layout>
    </div>
  );
};

export default TinyMCEEditor;
