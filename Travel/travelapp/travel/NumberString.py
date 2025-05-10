import random
import string


def numberString():
    unique_strings = set()

    while len(unique_strings) < 1:
        # Generate a random string
        random_string = ''.join(random.choices(string.ascii_letters + string.digits, k=6))
        unique_strings.add(random_string)

    return unique_strings

