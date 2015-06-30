---
template: job-ad.html
relative_path_to_root: ../../build/
greenhouse:
  jobs:
    - id: 1234
      title: 'Test job'
      location:
        name: 'Nowhere land'
      locations: 'Nowhere land'
      department:
        name: 'Test department'
      firstCategoryId: 'testing'
      firstCategory: 'Testing'
      content: '<p>It is a nice job, please apply now!</p>'
      questions:
        - label: 'First name'
          required: true
          fields:
            - type: 'input_text'
              name: 'first_name'
        - label: 'Last name'
          required: true
          fields:
            - type: 'input_text'
              name: 'last_name'
        - label: 'Email'
          required: true
          fields:
            - type: 'input_text'
              name: 'email'
        - label: 'Phone'
          fields:
            - type: 'input_text'
              name: 'phone'
        - label: 'CV'
          fields:
            - type: 'input_file'
              name: 'resume'
            - type: 'textarea'
              name: 'resume_text'
        - label: 'Cover Letter'
          fields:
            - type: 'input_file'
              name: 'cover_letter'
            - type: 'textarea'
              name: 'cover_letter_text'
        - label: 'Public LinkedIn profile'
          fields:
            - type: 'input_text'
              name: 'linkedin'
        - label: 'How did you hear about this job?'
          required: true
          fields:
            - type: 'multi_value_single_select'
              name: 'referrer'
              values:
              - value: 1
                label: 'Friend'
              - value: 2
                label: 'Media'
              - value: 3
                label: 'Search engine'
        - label: 'Preferred job locations'
          required: true
          fields:
            - type: 'multi_value_multi_select'
              name: 'locations'
              values:
              - value: 1
                label: 'Berlin'
              - value: 2
                label: 'Helsinki'
              - value: 3
                label: 'London'
              - value: 4
                label: 'New York'
---
