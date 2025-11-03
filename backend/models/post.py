class Post:
    def __init__(self, post_id, content, author_id):
        self.post_id = post_id
        self.content = content
        self.author_id = author_id

    def to_dict(self):
        return {
            "post_id": self.post_id,
            "content": self.content,
            "author_id": self.author_id
        }