import requests
import csv
import re
from io import StringIO

# URL for the First Nations historic sites csv file
RAW_DATA_URL = 'https://raw.githubusercontent.com/bcgov/inclusive-names-service/main/docs/test_data/ethno_historic_sites.csv'

# The path for the new CSV file to be created
NAMES_CSV = 'first_nation_names.csv'

def _contains_special_characters(site_name):
    # Returns True if the site name contains special characters (anything outside a-z, A-Z, and space)
    return not re.match(r'^[a-zA-Z\s]+$', site_name)


def _is_quoted(site_name):
    # Check if the site name is wrapped in quotation marks
    # Note: in the raw data csv, a mix of single and double quotes are used; the quotes are not always consistent
    return site_name[0] in ['"', "'", '‘' ,'“'] and site_name[-1] in ['"', "'", '’', '”']


def can_be_used_as_first_nation_name(site_name):
    # Check if the site name is a good candidate for First Nation name
    return (
        site_name != '' and                         # site name is not empty
        _contains_special_characters(site_name) and # we are only interested in strings that contain special characters
        not _is_quoted(site_name) and               # exclude English translation / explanation
        'IR ' not in site_name and                  # exclude location names that contain 'IR ' (Indian Reserve)
        'St.' not in site_name                      # exclude location names like 'Fort St. John'
    )


def generate_first_nation_names_csv():
    # Attempt to download the file
    response = requests.get(RAW_DATA_URL)

    if response.status_code == 200:
        csv_data = StringIO(response.content.decode('utf-8'))
        reader = csv.reader(csv_data)

        with open(NAMES_CSV, mode='w', newline='', encoding='utf-8') as outfile:
            writer = csv.writer(outfile)

            # Skip the header row
            next(reader)

            for row in reader:
                if row:
                    site_names = [site.strip() for site in row[0].split('|')]
                    individual_names = []
 
                    for site_name in site_names:
                        if can_be_used_as_first_nation_name(site_name):
                            individual_names.append(site_name)
                        if len(individual_names) == 2:
                            break

                    if individual_names:
                        writer.writerow(individual_names)

        print("Data processing complete.")
    else:
        print(f"Failed to obtain the data. Status code: {response.status_code}")


if __name__ == '__main__':
    generate_first_nation_names_csv()