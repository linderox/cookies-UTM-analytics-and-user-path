# GTM Implementation for UTM Tracking and Form Enrichment

This repository contains two JavaScript files designed to be implemented through Google Tag Manager (GTM). These scripts help track user journeys, save UTM parameters and visit paths into cookies, and dynamically enrich all forms on the website with hidden fields containing this data.

---

## Project Overview

### Files

1. **`saveUTMandPathToCookies.js`**
   - **Purpose**: 
     - Extract UTM parameters from the URL.
     - Save the UTM parameters, user journey, and visit path into cookies.
     - Handle user visit sessions, where each visit is identified and organized based on timestamps.
   - **Triggers**: Should be configured with **All Pages** in GTM.
   - **Example Data Stored in Cookies**:
     - `utm_source=test_source`
     - `utm_campaign=test_campaign`
     - `user_journey=example.com | test_source | test_campaign ->`
     - `visit_path={"Visit 1":{"1":"/","2":"/#go","3":"/#buy","4":"/#charts_secton"}}`

   - **Example `Visit` Data**:
     ```json
     {
       "Visit 1": {
         "1": "/",
         "2": "/#go",
         "3": "/#buy",
         "4": "/#charts_secton"
       },
       "Visit 2": {
         "1": "/",
         "2": "/catalog",
         "3": "/checkout",
         "4": "/thank-you"
       }
     }
     ```
     Each visit is tracked separately, and the pages within a visit are indexed sequentially.
 

2. **`addHiddenfieldsToForm.js`**
   - **Purpose**:
     - Read cookies set by `saveUTMandPathToCookies.js`.
     - Add hidden input fields to all forms on the website.
     - Include fields like `utm_source`, `utm_campaign`, `user_journey`, and `visit_path_json`.
   - **Triggers**: Should be configured with **DOM Ready** in GTM.
   - **Hidden Fields Added to Forms**:
     ```html
     <input type="hidden" name="utm_source" value="test_source">
     <input type="hidden" name="utm_campaign" value="test_campaign">
     <input type="hidden" name="user_journey" value="example.com | test_source | test_campaign ->">
     <input type="hidden" name="visit_path_json" value='{"Visit 1":{"1":"/","2":"/#go","3":"/#buy"}}'>
     ```

---

## Implementation in GTM

### 1. `saveUTMandPathToCookies.js`
- **Trigger**: `All Pages`
- **Purpose**: To save UTM parameters, user journey, and visit path into cookies.
- **Steps**:
  1. Create a new **Custom HTML Tag** in GTM.
  2. Paste the code from `saveUTMandPathToCookies.js`.
  3. Set the trigger to **All Pages**.
  4. Save and publish the container.

---

### 2. `addHiddenfieldsToForm.js`
- **Trigger**: `DOM Ready`
- **Purpose**: To read cookies and dynamically add hidden fields to all forms.
- **Steps**:
  1. Create a new **Custom HTML Tag** in GTM.
  2. Paste the code from `addHiddenfieldsToForm.js`.
  3. Set the trigger to **DOM Ready**.
  4. Save and publish the container.

---

## Example Cookie Data

### After visiting the URL:
https://example.com/?utm_source=test_source&utm_campaign=test_campaign

### Cookies Stored:
- `utm_source=test_source`
- `utm_campaign=test_campaign`
- `user_journey=example.com | test_source | test_campaign ->`
- `visit_path={"Visit 1":{"1":"/","2":"/#go","3":"/#buy","4":"/#charts_secton"}}`

---

## Example Hidden Fields Added to a Form

### Original Form:
```html
<form action="/submit" method="post">
    <input type="text" name="email" placeholder="Enter your email">
    <button type="submit">Submit</button>
</form>
```
### Modified Form:
```html
<form action="/submit" method="post">
    <input type="text" name="email" placeholder="Enter your email">
    <input type="hidden" name="utm_source" value="test_source">
    <input type="hidden" name="utm_campaign" value="test_campaign">
    <input type="hidden" name="user_journey" value="example.com | test_source | test_campaign ->">
    <input type="hidden" name="visit_path_json" value='{"Visit 1":{"1":"/","2":"/#go","3":"/#buy","4":"/#charts_secton"}}'>
    <button type="submit">Submit</button>
</form>
```
### Notes
Ensure both scripts are tested thoroughly in the GTM preview mode before publishing.
For debugging, enable console logs in the browser to verify the cookies and added fields.


### Usage Limits and Considerations
#### Cookies Size Limit:
Most browsers limit cookie size to 4KB. Large visit_path_json objects may exceed this limit.
To avoid issues, ensure that visit_path_json is kept concise by trimming old data or summarizing it.

#### Performance Impact:
Adding hidden fields dynamically to large numbers of forms may slightly impact page rendering performance on slower devices.

#### Cross-Browser Compatibility:
Test thoroughly in all target browsers to ensure cookies and hidden fields work as expected.

## License
This project is licensed under the MIT License. Feel free to use and modify it as needed.
