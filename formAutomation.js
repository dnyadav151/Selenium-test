const { Builder, By, Key, until } = require('selenium-webdriver')
const path = require('path')

async function scrollIntoView(driver, element){
  await driver.executeScript("arguments[0].scrollIntoView(true)", element)
  await driver.sleep(500)
}

async function automatePracticeForm() {
  let driver = await new Builder().forBrowser('chrome').build()

  try {
    console.log('Navigating to DemoQA practice form...')
    await driver.get('https://demoqa.com/automation-practice-form')
    await driver.manage().window().maximize()

    console.log('--- Starting Form Fill ---')

    await driver.findElement(By.id('firstName')).sendKeys('Devendra')
    await driver.findElement(By.id('lastName')).sendKeys('Pandey')
    console.log('Filled: First and Last Name')

    await driver.findElement(By.id('userEmail')).sendKeys('pandey.devendra@gmail.com')
    console.log('Filled: Email')

    const genderLabel = await driver.findElement(By.xpath("//label[text()='Male']"))
    await scrollIntoView(driver, genderLabel)
    await genderLabel.click()
    console.log('Selected: Gender')

    await driver.findElement(By.id('userNumber')).sendKeys('1234567890')
    console.log('Filled: Mobile Number')

    const dateOfBirthInput = await driver.findElement(By.id('dateOfBirthInput'))
    await dateOfBirthInput.click()

    const monthDropdown = await driver.findElement(By.className('react-datepicker__month-select'))
    await monthDropdown.findElement(By.css('option[value="8"]')).click()

    const yearDropdown = await driver.findElement(By.className('react-datepicker__year-select'))
    await yearDropdown.findElement(By.css('option[value="2001"]')).click()

    await driver.findElement(By.className('react-datepicker__day--028')).click()
    console.log('Selected: Date of Birth')

    const subjectsInput = await driver.findElement(By.id('subjectsInput'))
    await subjectsInput.sendKeys('Maths')
    await driver.wait(until.elementLocated(By.id('react-select-2-option-0')), 5000)
    await subjectsInput.sendKeys(Key.ENTER)
    console.log('Filled: Subjects')

    const sportsHobbyLabel = await driver.findElement(By.xpath("//label[text()='Sports']"))
    await scrollIntoView(driver, sportsHobbyLabel)
    await sportsHobbyLabel.click()
    console.log('Selected: Hobbies')

    const fileInput = await driver.findElement(By.id('uploadPicture'))
    const filePath = path.resolve(__dirname, 'test-image.png')
    await fileInput.sendKeys(filePath)
    console.log('Uploaded: Picture')

    await driver.findElement(By.id('currentAddress')).sendKeys('Supertech Ecovillage 2, greater noida')
    console.log('Filled: Current Address')

    const stateDropdown = await driver.findElement(By.id('state'))
    await scrollIntoView(driver, stateDropdown)
    await stateDropdown.click()
    const ncrOption = await driver.wait(until.elementLocated(By.xpath("//div[text()='Uttar Pradesh']")), 5000)
    await ncrOption.click()
    console.log('Selected: State')

    const cityDropdown = await driver.findElement(By.id('city'))
    await cityDropdown.click()
    const delhiOption = await driver.wait(until.elementLocated(By.xpath("//div[text()='Lucknow']")), 5000)
    await delhiOption.click()
    console.log('Selected: City')

    console.log('--- Form Fill Complete ---')

    const submitButton = await driver.findElement(By.id('submit'))

    await driver.executeScript("arguments[0].click();", submitButton)
    console.log('Submitting the form...')

    console.log('Verifying submission modal...')
    await driver.wait(until.elementLocated(By.id('example-modal-sizes-title-lg')), 10000);
    const modalTitle = await driver.findElement(By.id('example-modal-sizes-title-lg')).getText()

    if (modalTitle === 'Thanks for submitting the form') {
      console.log('SUCCESS: Modal appeared with the correct title.')

      const studentNameCell = await driver.findElement(By.xpath("//td[text()='Student Name']/following-sibling::td"))
      const studentName = await studentNameCell.getText()
      if (studentName === 'Devendra Pandey') {
        console.log('SUCCESS: Student Name verified in modal.')
      } else {
        console.error(`FAILURE: Student Name mismatch. Expected "Devendra Pandey", got "${studentName}"`)
      }

      const studentEmailCell = await driver.findElement(By.xpath("//td[text()='Student Email']/following-sibling::td"))
      const studentEmail = await studentEmailCell.getText()
      if (studentEmail === 'pandey.devendra@gmail.com') {
        console.log('SUCCESS: Student Email verified in modal.')
      } else {
        console.error(`FAILURE: Student Email mismatch. Expected "pandey.devendra@gmail.com", got "${studentEmail}"`)
      }

    } else {
      console.error(`FAILURE: Modal title is incorrect. Found: "${modalTitle}"`)
    }

    const closeModalButton = await driver.findElement(By.id('closeLargeModal'))
    await driver.executeScript("arguments[0].click();", closeModalButton)
    console.log('Closed the submission modal.')


  } catch (error) {
    console.error('An error occurred during the automation script:', error)
  } finally {
    console.log('Closing the browser...')
    await driver.quit();
  }
}

automatePracticeForm();
