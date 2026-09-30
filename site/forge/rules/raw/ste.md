# Simplified Technical English

Write prose that obeys ASD-STE100 Simplified Technical English (STE),
Issue 9. Rule numbers in parentheses refer to part 1 of that standard.

## Always

- Write short sentences. Use a maximum of 25 words in each sentence. (6.3)
- Count a code span, an identifier, or a number with its unit as one word.
- Give each sentence one topic. (6.1)
- Give each paragraph one topic. Use a maximum of six sentences. (6.5, 6.6)
- Use the active voice. Use the passive voice only when the agent is
  unknown. (3.6)
- Use a verb to describe an action, not a noun. Write "the loader fails",
  not "a failure of the loader occurs". (3.7)
- Use the same term for the same concept. Do not alternate between
  "function", "method", and "routine" in one answer. (1.11, 9.4)
- Write multi-word nouns of no more than three words. (2.1)
- Do not use contractions. Write "do not", not "don't". (4.2)
- Do not omit words. Use an article before a noun. (4.2, 4.5)
- Do not use the semicolon. Write two sentences. (8.1)
- Do not use a dash to join two statements. Write two sentences. (6.1)
- Do not use phrasal verbs. Write "install", not "set up". (9.3)
- Use a vertical list for a genuine enumeration, not to break up prose. (4.3)
- Use American English spelling. (1.14)

## In numbered steps

Procedures and numbered steps obey these additional rules.

- Write each instruction in the imperative form. Write "open the file",
  not "you can now open the file". (5.3)
- Use "must" for a requirement. Do not use "should". Write "a green
  check shows", not "you should see a green check".
- Use a maximum of 20 words in each step. (5.1)
- Write one instruction in each step. (5.2)
- Use only the infinitive, the imperative, the simple present, the simple
  past, the simple future, and the past participle as an adjective. (3.2)
- Do not use the "-ing" form of a verb. (3.5)
- When the reader must know a condition first, write the condition, then a
  comma, then the command. (5.4)
- Write a warning before a step that risks data loss or an outage. Name
  the risk and the result. (7.1, 7.3)

## Vocabulary

Do not apply the controlled dictionary in part 2 of the standard. Apply
rules 1.5, 1.6, and 1.12 instead. Technical nouns and technical verbs from
the subject field are permitted. A technical verb can be a phrasal verb,
such as "roll back" or "spin up". Software terms such as "idempotent" and
"symlink" stay in use.

## Scope

STE governs all prose that the agent writes. The reader does not change
this requirement. It governs:

- Replies to the user in a session.
- Text that the agent sends to another person or to a service. Examples
  are a pull request body, a pull request comment, a code review reply,
  an issue comment, and a chat message.
- Documentation prose that the agent writes or edits.

Before you send any prose, and this includes a reply to the user, check
the three rules that you break most often:

- Sentence fragments and omitted words (4.2, 4.5).
- The passive voice (3.6).
- Sentence length (6.3).

STE does not govern:

- Quoted text, file contents, and tool output. Reproduce these exactly.
- Code and code comments.
- Artifacts with their own house style, such as a commit message. The
  project convention wins on structure, format, and required phrases.
  STE governs the remaining prose.
