import sys
import json
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC



class Product:
    def __init__(self, name, price, parc, url, image_url):
        self.name = name
        self.price = price
        self.parc = parc
        self.url = url
        self.image_url = image_url



def search_products_amazon(query):

# Substitua o caminho pelo seu perfil do Chrome
    profile_path = "C:/Users/leona/AppData/Local/Google/Chrome/User Data"

    # Configurando as opções do Chrome para usar o perfil
    options = webdriver.ChromeOptions()
    #options.add_argument('--headless')
    options.add_argument("user-data-dir=" + profile_path)
    chrome_path = "C:/Program Files/Google/Chrome/Application/chrome.exe"
    options.add_argument('--remote-debugging-address=127.0.0.1')
    options.add_argument('--remote-debugging-port=9222')
    
    options.binary_location = chrome_path
    #chromedriver_path = ".\src\pythonchromedriver.exe"
    driver = webdriver.Chrome(options=options)
    
    

    #driver = webdriver.Chrome(options=options)
    
    driver.get("https://www.amazon.com.br/")
    time.sleep(2)
    
    wait_for(driver, By.ID, "twotabsearchtextbox")
    
    search_box = driver.find_element(By.ID, "twotabsearchtextbox")
    search_box.send_keys(query)
    search_box.submit()

    wait_for(driver, By.ID, "search")
    
    products_list = []
    
    time.sleep(4)
    for i in range(2, 5):
        xpath = f"(//div[contains(@class, 's-result-item') and (@data-cel-widget = 'search_result_{i}')])"
        element = driver.find_element(By.XPATH, xpath)

        name = element.find_element(By.CSS_SELECTOR, ".a-size-base-plus.a-color-base.a-text-normal").get_attribute("innerHTML")
        price = element.find_element(By.CSS_SELECTOR, ".a-offscreen").get_attribute("innerHTML").replace("&nbsp;", "")
       
        parc_list = element.find_elements(By.XPATH,xpath+"//div[@class='a-row a-size-base a-color-base']/div[2]/span" ) # ".a-color-secondary span"
        
        parc = ''.join([p.get_attribute("innerText").replace("&nbsp;", "") for p in parc_list])
        
        url = element.find_element(By.CSS_SELECTOR, ".a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal").get_attribute("href")
        image_url = element.find_element(By.CSS_SELECTOR, ".s-image").get_attribute("src")

        product_instance = Product(name, price, parc, url, image_url)
        products_list.append(product_instance)

    produtos = json.dumps([product.__dict__ for product in products_list], indent=4)
    
    driver.quit()
    return produtos

def wait_for(driver, by, value, timeout=10):
    wait = WebDriverWait(driver, timeout)
    wait.until(EC.presence_of_element_located((by, value)))

if __name__ == "__main__":
    jsontxt = search_products_amazon(query=sys.argv[1])
    print(jsontxt)
