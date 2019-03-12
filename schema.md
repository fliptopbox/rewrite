# database

# front-end

## settings

    articles            Collection (derived from data items)
    current String
        sync
            guid        String
            ts          Timestamp
        modifiers
            collapsed
            strikethrough
            typewriter
            dark
        values
            fontsize    Number
            dividerwidth Float

## article

    guid
        guid            String
        name            String
        created         Timestamp
        modified        Timestamp
        format          Number [plaintext, markdown, fountain]
        current         Collection
        revisions       Array
            data        Collection
            label       String or Timestamp

## article schema

    [
        {
            text        String
            versions    Array
            inactive    Boolean
            wordcount   Number

        }
    ]
