from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
import time
import sys
import json
import requests
class Product:
    def __init__(self, name, price, parc, url, image_url):
        self.name = name
        self.price = price
        self.parc = parc
        self.url = url
        self.image_url = image_url

    


def search_products_amazon(query):
    
    
    # create a new Chrome browser instance
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    driver = webdriver.Chrome(options=options)

    # navigate to Amazon's homepage
    driver.get("https://www.amazon.com.br/")

    # wait for the search box to appear
    wait_for(driver, By.ID, "twotabsearchtextbox")

    # find the search box and search for a product
    search_box = driver.find_element(By.ID, "twotabsearchtextbox")
    
    search_box.send_keys(query)
    search_box.submit()

    # wait for the search results to appear
    wait_for(driver, By.ID, "search")

    # print the search results
    # //div[contains(@class, 's-result-item') and (@data-cel-widget = 'search_result_2')]
    
    products_list = []
    
    for i in range(2,5):
        element = driver.find_element(By.XPATH, f"//div[contains(@class, 's-result-item') and (@data-cel-widget = 'search_result_{i}')]")

        name = element.find_element(By.CSS_SELECTOR, ".a-size-base-plus.a-color-base.a-text-normal").get_attribute("innerHTML")
        price = element.find_element(By.CSS_SELECTOR, ".a-offscreen").get_attribute("innerHTML").replace("&nbsp;", "")
        parc_list = element.find_elements(By.CSS_SELECTOR, ".a-color-secondary")
        
        for p in parc_list:
            parc =''.join(p.find_element(By.XPATH, "//span").text.replace("&nbsp;", ""))
       
        url = element.find_element(By.CSS_SELECTOR, ".a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal").get_attribute("href")
        image_url = element.find_element(By.CSS_SELECTOR, ".s-image").get_attribute("src")

        
        # Criando uma instância da classe Product
        product_instance = Product(name, price, parc, url, image_url)

        # Adicionando a instância à lista
        products_list.append(product_instance)

    
    produtos = json.dumps([product.__dict__ for product in products_list], indent=4)
       # produtos = str(f"*NOME DO PRODUTO:*: {product_instance.name}\n *Preço*: {product_instance.price}\n *Parcelamento*: {product_instance.parc}\n *Link*: {product_instance.url}\n ImageURL: {product_instance.image_url}\n\n")

        #produtos = ''.join([str(f"*NOME DO PRODUTO:*: {product_instance.name}\n *Preço*: {product_instance.price}\n *Parcelamento*: {product_instance.parc}\n *Link*: {product_instance.url}\n ImageURL: {product_instance.image_url}\n\n") for product_instance in products_list])
    
    
    # close the browser
    driver.quit()
    return produtos


def wait_for(driver, by, value, timeout=10):
    """
    Wait for an element to appear on the page.
    :param driver: The webdriver instance.
    :param by: The type of selector to use (e.g. By.ID, By.CLASS_NAME, etc.).
    :param value: The value of the selector.
    :param timeout: The maximum amount of time to wait (in seconds).
    """
    wait = WebDriverWait(driver, timeout)
    wait.until(EC.presence_of_element_located((by, value)))

if __name__ == "__main__":

    jsontxt = search_products_amazon(query=sys.argv[1])
    print(str(jsontxt))